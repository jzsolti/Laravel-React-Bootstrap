<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\File;
use Illuminate\Support\Facades\Storage;
use App\Models\Article;
use App\Http\Resources\ArticlesResource, App\Http\Resources\ArticleResource;
use App\Http\Requests\ArticleRequest;

class UserArticleController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
    }

    public function index(Request $request)
    {
        $query  = Article::where('user_id', $request->user()->id)->orderBy($request->column, $request->order);
        $articles = $query->paginate($request->per_page ?? 10);

        return ArticlesResource::collection($articles);
    }

    public function article(Request $request, Article $article)
    {
        if ($request->user()->id !== $article->user_id) {
            abort(404);
        }

        return new ArticleResource($article);
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function create(ArticleRequest $request)
    {
        if ($request->hasFile('image') && $request->file('image')->isValid()) {
            $path = Storage::disk('public')->putFile(Article::IMAGE_PATH, new File($request->image->path()));
            $filename = str_replace(Article::IMAGE_PATH, "", $path);
        }

        $article = Article::create([
            'user_id' => $request->user()->id,
            'title' => $request->title,
            'lead' => $request->lead,
            'content' => $request->content,
            'image' => $filename ?? null
        ]);

        if($request->article_labels){
            $article->labels()->attach($request->article_labels);
        }

        return response(['id' => $article->id]);
    }

    public function update(ArticleRequest $request, Article $article)
    {
        if ($request->user()->id !== $article->user_id) {
            abort(404);
        }

        if ($request->hasFile('image') && $request->file('image')->isValid()) {
            $this->deleteArticleImage($article);
            $path = Storage::disk('public')->putFile(Article::IMAGE_PATH, new File($request->image->path()));
            $filename = str_replace(Article::IMAGE_PATH, "", $path);
        }

        $article->update([
            'title' => $request->title,
            'lead' => $request->lead,
            'content' => $request->content,
            'image' => $filename ?? null
        ]);
        if($request->article_labels){
            $article->labels()->sync($request->article_labels);
        }else{
            $article->labels()->detach();
        }
        return response(['updated' => true]);
    }

    public function delete(Request $request, Article $article)
    {
        if ($request->user()->id !== $article->user_id) {
            abort(404);
        }

        $this->deleteArticleImage($article);
        $article->labels()->detach();
        $article->delete();

        return response(['deleted' => true]);
    }

    public function deleteImage(Request $request, Article $article)
    {
        if ($request->user()->id !== $article->user_id) {
            abort(404);
        }

        $this->deleteArticleImage($article);

        return response(['deleted' => true]);
    }

    private function deleteArticleImage($article)
    {
        if ($article->image &&  Storage::disk('public')->exists($article->imagePath)) {
            Storage::disk('public')->delete($article->imagePath);
            $article->image = null;
            $article->save();
        }
    }
}
