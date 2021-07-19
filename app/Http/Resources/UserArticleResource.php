<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\Article;

class UserArticleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'lead' => $this->lead,
            'content' => $this->content,
            'image_src' => !is_null($this->image)? Article::IMAGE_URL . $this->image : null,
            'created_at' => $this->created_at->format('Y-m-d'),
            'labels' => $this->labels->pluck('id')->toArray()
        ];
    }
}
