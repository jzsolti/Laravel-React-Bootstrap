<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class ArticleResource extends JsonResource
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
            'edit' => '/user/article/'.$this->id,
            'title' => $this->title,
            'lead' => Str::limit($this->lead, 20),
            'content' => $this->content,
            'created_at' => $this->created_at->format('Y-m-d')
        ];
    }
}
