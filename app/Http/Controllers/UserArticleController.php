<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\ArticleRequest;
use App\Models\Article;
use DB;

class UserArticleController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index(Request $request)
    {
        $articles = Article::where('user_id', $request->user()->id)->orderBy('created_at','desc')->get();

        $response = [];

        foreach ($articles as $i => $article) {
            $article->created = $article->created_at->format('Y-m-d');
            $response[$i] = $article;
        }

        return response($response);
    }

    public function article(Request $request, Article $article)
    {
        if ($request->user()->id !== $article->user_id) {
            abort(404);
        }
        return response($article->only(['title', 'lead', 'content']));
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function create(ArticleRequest $request)
    {
        $article = Article::create([
            'user_id' => $request->user()->id,
            'title' => $request->title,
            'lead' => $request->lead,
            'content' => $request->content,
        ]);

        return response(['id' => $article->id]);
    }

    public function update(ArticleRequest $request, Article $article)
    {
        if ($request->user()->id !== $article->user_id) {
            abort(404);
        }

        $article->update([
            'title' => $request->title,
            'lead' => $request->lead,
            'content' => $request->content,
        ]);
        return response(['updated' => true]);
    }
}
