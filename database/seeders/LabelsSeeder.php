<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Generator as Faker;

class LabelsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = \Faker\Factory::create('en');

        for($i = 0; $i < 20; $i++){
            DB::table('labels')->insert([
                'name' => $faker->word,
            ]);
        }
       
    }
}
