<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ArticleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'lead' => ['required', 'string', 'max:500'],
            'content' => ['required', 'string', 'max:50000'],
            'image' => ['nullable', 'image'],
            'article_labels' => ['nullable', 'array'],
            'article_labels.*' => ['exists:App\Models\Label,id']
        ];
    }
}
