<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Builder;
use App\Models\Article;

use App\Http\Resources\ArticlesResource;

class ArticlesController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'labels' => 'nullable|array',
            'search' => 'nullable|max:255',
        ]);

        $articles = Article::orderBy('created_at', 'desc');

        if ($request->has('search')) {
            $articles->where('title', 'like', $request->search . '%')->orWhere('content', 'like', '%' . $request->search . '%');
        }

        if ($request->has('labels')) {
            $articles->whereHas('labels', function (Builder $query) use ($request) {
                $query->whereIn('id', $request->labels);
            });
        }
 
        return ArticlesResource::collection($articles->paginate($request->per_page ?? 10));
    }
}
