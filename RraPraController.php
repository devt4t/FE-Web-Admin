<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use DB;
use App\ScoopingVisit;
use App\ScoopingVisitFigure;
use App\VillageBorder;
use App\Rra;
use App\RraDusun;
use App\RraLandUse;
use App\RraCommunityInstitution;
use App\RraExistingPlant;
use App\RraOrganicPotential;
use App\RraProductionMarketing;
use App\RraInnovativeFarmer;

use App\Desa;
use App\Pra;
use App\PraDisasterDetail;
use App\PraFertilizerDetail;
use App\PraDryLandSpread;
use App\PraLandOwnership;
use App\PraPesticideDetail;
use App\PraWatersourceDetail;
use App\PraExistingProblem;
use App\PraFarmerIncome;

use App\SocialimpactFaunaDetail;
use App\SocialimpactFloraDetail;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Mail;

class RraPraController extends Controller
{
    //NEW GEKO API
    // Scooping Visit
    public function GetNewScoopingAll(Request $request)
    {
        $employeeUser = $this->getFCListByUserUMPY();

        $req = $request->all();
        $searchValue = $request->search_value;
        $searchable = ['A.data_no', 'B.name'];
        $filterable = [
            'code' => [
                'request_value' => $request->purpose_code,
                'table_alias' => 'G',
                'operator' => '='
            ],
            'program_year' => [
                'request_value' => $request->program_year,
                'table_alias' => 'A',
                'operator' => '='
            ],
            'code' => [
                'request_value' => $request->type_code,
                'table_alias' => 'H',
                'operator' => '='
            ]
            // 'province' => [
            //         'request_value' => $request->purpose_code,
            //         'table_alias' => 'G',
            //         'operator' => '='
            //     ], 
            // 'city', 
            // 'village'
        ];

        $sortable = ['id', 'data_no', 'start_scooping_date', 'end_scooping_date'];
        $tableName = "scooping_visits";
        $tableAlias = "A";

        $limit = isset($req['limit']) ? $req['limit'] : 10;
        $offset = isset($req['offset']) ? $req['offset'] : 0;
        $field = [
            '*'
        ];

        $group_concat = [
            "scooping_project_id" => [
                "table_alias" => 'F',
                "column_name" => 'id_project'
            ],
            // "project_name" => [
            //     "table_alias" => 'G',
            //     "column_name" => 'project_name'
            //     ]
        ];

        $relation = [
            "village" => [
                "reference_table" => "desas",
                "table_alias" => "B",
                "reference_column" => "kode_desa",
                "display" => ['kode_desa', 'name'],
            ],
            "user_id" => [
                "reference_table" => "users",
                "table_alias" => "C",
                "reference_column" => "email",
                "display" => ['id', 'name'],
            ],
            "employee_no" => [
                "reference_table" => "employee_structure",
                "table_alias" => "D",
                "reference_column" => "nik",
                "display" => ['id', 'manager_code'],
                "origin_table" => "C"
            ],
            "manager_code" => [
                "reference_table" => "employees",
                "table_alias" => "E",
                "reference_column" => "nik",
                "display" => ['id', 'name'],
                "origin_table" => "D"
            ],
            "data_no" => [
                "reference_table" => "scooping_visit_projects",
                "table_alias" => "F",
                "reference_column" => "id",
                "display" => ['id', 'scooping_id']
            ],
            "id_project" => [
                "reference_table" => "projects",
                "table_alias" => "G",
                "reference_column" => "id",
                "display" => [],
                "origin_table" => "F",
            ],
            // "project_planting_purpose_id" => [
            //     "reference_table" => "project_planting_purposes",
            //     "table_alias" => "H",
            //     "reference_column" => "id",
            //     "origin_table" => "F",
            //     "display" => []
            //     ],
            // "project_planting_type_id" => [
            //     "reference_table" => "project_types",
            //     "table_alias" => "I",
            //     "reference_column" => "id",
            //     "origin_table" => "F",
            //     "display" => []
            //     ],
        ];

        if (isset($request->data_no)) {
            $filterable['id'] = [
                'request_value' => $request->data_no == 0 ? 'NULL' : 'NOT NULL',
                'table_alias' => 'I',
                'operator' => 'IS',
                'is_nullable' => true
            ];


            $relation['data_no'] = [
                "reference_table" => "rras",
                "table_alias" => "I",
                "reference_column" => "form_no",
                "display" => ['id'],
                "origin_table" => "A"
            ];
        }
        $condition = [
            "is_dell" => [
                "conditional_table" => "scooping_visits",
                "conditional_table_alias" => "A",
                "conditional_column" => "is_dell",
                "conditional_param" => "=",
                "conditional_value" => '0',
            ],
        ];
        $user_id = [
            "user_id" => [
                "listId" => $employeeUser
            ],
        ];


        $query = $this->DynamicList([
            'tableName' => $tableName,
            'tableAlias' => $tableAlias,
            'limit' => $limit,
            'offset' => $offset,
            'field' => $field,
            'sortable' => $sortable,
            'filterable' => $filterable,
            'relation' => $relation,
            'searchable' => $searchable,
            'search' => $searchValue,
            'condition' => $condition,
            'group_concat' => $group_concat,
            'concat_alias' => 'project_data',
            'req' => $req,
            'users_id' => $user_id
        ]);
        $statistic = $this->DynamicCount([
            'tableName' => $tableName,
            'indicator_column' => 'is_verify',
            'relation' => $relation,
            'users_id' => $user_id,
            'condition' => $condition,
            'filterable' => $filterable,
        ]);


        $result = DB::select($query['sql']);

        $result_record = DB::select($query['sql_record']);

        $rslt = DB::select($statistic);

        return response()->json([
            'data' => $result,
            'count' => $rslt[0],
            'sql' => $query['sql'],
            'total' => $result_record[0]->total
        ], 200);
    }
    public function AddScoopingVisit_new(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'village' => 'required',
        ]);
        if ($validator->fails()) {
            $rslt = $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        } {
            // Configure code
            $scooping_no = ScoopingVisit::Maxno();

            // Base Code
            $tableName = 'scooping_visits';

            $createDatas = [
                "0" => ['table_header' => 'data_no', 'table_new_data' => $scooping_no, 'type' => 'string'],
                "1" => ['table_header' => 'province', 'table_new_data' => $request->province, 'type' => 'string'],
                "2" => ['table_header' => 'city', 'table_new_data' => $request->city, 'type' => 'string'],
                "3" => ['table_header' => 'district', 'table_new_data' => $request->district, 'type' => 'string'],
                "4" => ['table_header' => 'village', 'table_new_data' => $request->village, 'type' => 'string'],
                "5" => ['table_header' => 'start_scooping_date', 'table_new_data' => $request->start_date, 'type' => 'string'],
                "6" => ['table_header' => 'end_scooping_date', 'table_new_data' => $request->end_date, 'type' => 'string'],
                "7" => ['table_header' => 'accessibility', 'table_new_data' => $request->accessibility, 'type' => 'string'],
                "8" => ['table_header' => 'land_area', 'table_new_data' => $request->land_area, 'type' => 'string'],
                // "9" => ['table_header' => 'land_type',              'table_new_data' => $request->land_type,        'type' => 'string'],
                // "10" => ['table_header' => 'slope',                 'table_new_data' => $request->slope,            'type' => 'string'],
                // "11" => ['table_header' => 'altitude',              'table_new_data' => $request->altitude,         'type' => 'string'],
                "9" => ['table_header' => 'vegetation_density', 'table_new_data' => $request->vegetation_density, 'type' => 'string'],
                "10" => ['table_header' => 'water_source', 'table_new_data' => $request->water_source, 'type' => 'string'],
                // "14" => ['table_header' => 'rainfall',              'table_new_data' => $request->rainfall,         'type' => 'string'],
                "11" => ['table_header' => 'agroforestry_type', 'table_new_data' => $request->agroforestry_type, 'type' => 'string'],
                "12" => ['table_header' => 'goverment_place', 'table_new_data' => $request->goverment_place, 'type' => 'string'],

                "13" => ['table_header' => 'land_coverage', 'table_new_data' => $request->land_coverage, 'type' => 'string'],
                "14" => ['table_header' => 'electricity_source', 'table_new_data' => $request->electricity_source, 'type' => 'string'],
                "15" => ['table_header' => 'dry_land_area', 'table_new_data' => $request->dry_land_area, 'type' => 'int'],
                // "20" => ['table_header' => 'village_polygon',       'table_new_data' => $request->village_polygon,  'type' => 'string'],
                // "21" => ['table_header' => 'dry_land_polygon',      'table_new_data' => $request->dry_land_polygon, 'type' => 'string'],
                "16" => ['table_header' => 'total_dusun', 'table_new_data' => $request->total_dusun, 'type' => 'string'],
                "17" => ['table_header' => 'potential_dusun', 'table_new_data' => $request->potential_dusun, 'type' => 'string'],
                "18" => ['table_header' => 'potential_description', 'table_new_data' => $request->potential_description, 'type' => 'string'],
                "19" => ['table_header' => 'total_male', 'table_new_data' => $request->total_male, 'type' => 'int'],
                "20" => ['table_header' => 'total_female', 'table_new_data' => $request->total_female, 'type' => 'int'],
                "21" => ['table_header' => 'total_kk', 'table_new_data' => $request->total_kk, 'type' => 'int'],
                "22" => ['table_header' => 'photo_road_access', 'table_new_data' => $request->photo_road_access, 'type' => 'string'],
                "23" => ['table_header' => 'photo_meeting', 'table_new_data' => $request->photo_meeting, 'type' => 'string'],
                "24" => ['table_header' => 'photo_dry_land', 'table_new_data' => $request->photo_dry_land, 'type' => 'string'],
                "25" => ['table_header' => 'village_profile', 'table_new_data' => $request->village_profile, 'type' => 'string'],
                "26" => ['table_header' => 'status', 'table_new_data' => $request->status, 'type' => 'string'],
                "27" => ['table_header' => 'complete_data', 'table_new_data' => $request->complete_data, 'type' => 'int'],
                "28" => ['table_header' => 'project_id', 'table_new_data' => $request->project_id, 'type' => 'int'],

                "29" => ['table_header' => 'is_dell', 'table_new_data' => 0, 'type' => 'int'],
                "30" => ['table_header' => 'user_id', 'table_new_data' => $request->user_email, 'type' => 'string'],
                "31" => ['table_header' => 'created_at', 'table_new_data' => Carbon::now()],
                "32" => ['table_header' => 'updated_at', 'table_new_data' => Carbon::now()],
                "33" => ['table_header' => 'program_year', 'table_new_data' => $request->program_year, 'type' => 'int'],
                "34" => ['table_header' => 'potential_status', 'table_new_data' => $request->potential_status, 'type' => 'int'],
                "35" => ['table_header' => 'potential_status_description', 'table_new_data' => $request->potential_status_description, 'type' => 'string'],

                "36" => ['table_header' => 'other_ngo', 'table_new_data' => $request->other_ngo, 'type' => 'int'],
                "37" => ['table_header' => 'resident_acceptance', 'table_new_data' => $request->resident_acceptance, 'type' => 'string'],
                "38" => ['table_header' => 'next_event_contact_person', 'table_new_data' => $request->next_event_contact_person, 'type' => 'string'],
                "39" => ['table_header' => 'general_land_condition', 'table_new_data' => $request->general_land_condition, 'type' => 'string'],
                "40" => ['table_header' => 'field_companion_potency', 'table_new_data' => $request->field_companion_potency, 'type' => 'string'],
                "41" => ['table_header' => 'ff_candidate', 'table_new_data' => $request->ff_candidate, 'type' => 'string'],
            ];


            $datas = $this->dynamicCreate([
                'tableName' => $tableName,
                'inputData' => $createDatas,
            ]);

            $result = DB::insert($datas);
            return response()->json([
                'result' => $result,
                'sql' => $datas,
                'kode_scooping' => $scooping_no
            ], 200);

        }
    }
    public function AddScoopingVisitFigures_new(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'data_no' => 'required',
            'name' => 'required',
            'position' => 'required',
            'phone' => 'required',
            'whatsapp' => 'required',
        ]);
        if ($validator->fails()) {
            $rslt = $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        } else {
            $tableName = 'scooping_visit_figures';
            $createDatas = [
                "0" => ['table_header' => 'data_no', 'table_new_data' => $request->data_no, 'type' => 'string'],
                "1" => ['table_header' => 'name', 'table_new_data' => $request->name, 'type' => 'string'],
                "2" => ['table_header' => 'position', 'table_new_data' => $request->position, 'type' => 'string'],
                "3" => ['table_header' => 'phone', 'table_new_data' => $request->phone, 'type' => 'string'],
                "4" => ['table_header' => 'whatsapp', 'table_new_data' => $request->whatsapp, 'type' => 'string'],
                "5" => ['table_header' => 'created_at', 'table_new_data' => Carbon::now()],
                "6" => ['table_header' => 'updated_at', 'table_new_data' => Carbon::now()]
            ];

            $datas = $this->dynamicCreate([
                'tableName' => $tableName,
                'inputData' => $createDatas,
            ]);

            $result = DB::insert($datas);
            return response()->json([
                'result' => $result,
                'sql' => $datas,
            ], 200);

        }
    }
    public function AddScoopingProject_new(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'data_no' => 'required',
            'project_id' => 'required',
        ]);
        if ($validator->fails()) {
            $rslt = $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        } else {
            $projectData = DB::table('projects')->pluck('id')->toArray();
            if (in_array($request->project_id, $projectData)) {
                // return response() -> json('project id '.$request->project_id.' found!');
                $tableName = 'scooping_visit_projects';
                $createDatas = [
                    "0" => ['table_header' => 'scooping_id', 'table_new_data' => $request->data_no, 'type' => 'string'],
                    "1" => ['table_header' => 'id_project', 'table_new_data' => $request->project_id, 'type' => 'int'],
                    "2" => ['table_header' => 'created_at', 'table_new_data' => Carbon::now()],
                    "3" => ['table_header' => 'updated_at', 'table_new_data' => Carbon::now()]
                ];

                $datas = $this->dynamicCreate([
                    'tableName' => $tableName,
                    'inputData' => $createDatas,
                ]);

                $result = DB::insert($datas);
                return response()->json([
                    'result' => $result,
                    'sql' => $datas,
                ], 200);
            } else {
                return response()->json([
                    'message: ' => 'No Project Data Found!'
                ]);
            }


        }
    }
    public function AddScoopingVisitNGOCompetitor_new(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'data_no' => 'required',
            'competitor_name' => 'required',
        ]);
        if ($validator->fails()) {
            $rslt = $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        } else {
            $tableName = 'scooping_visit_ngo_competitor';
            $createDatas = [
                "0" => ['table_header' => 'scooping_data_no', 'table_new_data' => $request->data_no, 'type' => 'string'],
                "1" => ['table_header' => 'competitor_name', 'table_new_data' => $request->competitor_name, 'type' => 'string'],
                "2" => ['table_header' => 'created_at', 'table_new_data' => Carbon::now()],
                "3" => ['table_header' => 'updated_at', 'table_new_data' => Carbon::now()],
                "4" => ['table_header' => 'is_del', 'table_new_data' => 0, 'type' => 'int']
            ];

            $datas = $this->dynamicCreate([
                'tableName' => $tableName,
                'inputData' => $createDatas,
            ]);

            $result = DB::insert($datas);
            return response()->json([
                'result' => $result,
                'sql' => $datas,
            ], 200);
        }

    }

    public function UpdateScoopingVisit_new(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'current_id' => 'required',
            'data_no' => 'required',
            'province' => 'required',
            'city' => 'required',
            'district' => 'required',
            'village' => 'required',
            'start_date' => 'required',
            'end_date' => 'required',
            'accessibility' => 'required',
            'land_area' => 'required',
            // 'land_type' => 'required',
            // 'slope' => 'required',
            // 'altitude' => 'required',
            'vegetation_density' => 'required',
            'water_source' => 'required',
            // 'rainfall' => 'required',
            'agroforestry_type' => 'required',
            'goverment_place' => 'required',
            'land_coverage' => 'required',
            'electricity_source' => 'required',
            'dry_land_area' => 'required',
            // 'village_polygon' => 'required',
            // 'dry_land_polygon' => 'required',
            'total_dusun' => 'required',
            'potential_dusun' => 'required',
            'potential_description' => 'required',
            'total_male' => 'required',
            'total_female' => 'required',
            'total_kk' => 'required',
            'status' => 'required',
            'project_id' => 'required',
            'complete_data' => 'required',
            'program_year' => 'required',
            // 'potential_status' => 'required',
            // 'potential_status_description' => 'required',
            // 'other_ngo' => 'required',
            // 'resident_acceptance' => 'required',
            // 'next_event_contact_person' => 'required',
            // 'general_land_condition' => 'required',
            // 'field_companion_potency' => 'required',
            // 'ff_candidate' => 'required'
        ]);
        if ($validator->fails()) {
            $rslt = $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        } {


            // Base Code
            $current_id = $request->current_id;
            $tableName = 'scooping_visits';

            $updateDatas = [
                "0" => ['table_header' => 'data_no', 'table_new_data' => $request->data_no, 'type' => 'string'],
                "1" => ['table_header' => 'province', 'table_new_data' => $request->province, 'type' => 'string'],
                "2" => ['table_header' => 'city', 'table_new_data' => $request->city, 'type' => 'string'],
                "3" => ['table_header' => 'district', 'table_new_data' => $request->district, 'type' => 'string'],
                "4" => ['table_header' => 'village', 'table_new_data' => $request->village, 'type' => 'string'],
                "5" => ['table_header' => 'start_scooping_date', 'table_new_data' => $request->start_date, 'type' => 'string'],
                "6" => ['table_header' => 'end_scooping_date', 'table_new_data' => $request->end_date, 'type' => 'string'],
                "7" => ['table_header' => 'accessibility', 'table_new_data' => $request->accessibility, 'type' => 'string'],
                "8" => ['table_header' => 'land_area', 'table_new_data' => $request->land_area, 'type' => 'string'],
                "9" => ['table_header' => 'land_type', 'table_new_data' => $request->land_type, 'type' => 'string'],
                "10" => ['table_header' => 'slope', 'table_new_data' => $request->slope, 'type' => 'string'],
                "11" => ['table_header' => 'altitude', 'table_new_data' => $request->altitude, 'type' => 'string'],
                "12" => ['table_header' => 'vegetation_density', 'table_new_data' => $request->vegetation_density, 'type' => 'string'],
                "13" => ['table_header' => 'water_source', 'table_new_data' => $request->water_source, 'type' => 'string'],
                "14" => ['table_header' => 'rainfall', 'table_new_data' => $request->rainfall, 'type' => 'string'],
                "15" => ['table_header' => 'agroforestry_type', 'table_new_data' => $request->agroforestry_type, 'type' => 'string'],
                "16" => ['table_header' => 'goverment_place', 'table_new_data' => $request->goverment_place, 'type' => 'string'],

                "17" => ['table_header' => 'land_coverage', 'table_new_data' => $request->land_coverage, 'type' => 'string'],
                "18" => ['table_header' => 'electricity_source', 'table_new_data' => $request->electricity_source, 'type' => 'string'],
                "19" => ['table_header' => 'dry_land_area', 'table_new_data' => $request->dry_land_area, 'type' => 'int'],
                "20" => ['table_header' => 'village_polygon', 'table_new_data' => $request->village_polygon, 'type' => 'string'],
                "21" => ['table_header' => 'dry_land_polygon', 'table_new_data' => $request->dry_land_polygon, 'type' => 'string'],
                "22" => ['table_header' => 'total_dusun', 'table_new_data' => $request->total_dusun, 'type' => 'string'],
                "23" => ['table_header' => 'potential_dusun', 'table_new_data' => $request->potential_dusun, 'type' => 'string'],
                "24" => ['table_header' => 'potential_description', 'table_new_data' => $request->potential_description, 'type' => 'string'],
                "25" => ['table_header' => 'total_male', 'table_new_data' => $request->total_male, 'type' => 'int'],
                "26" => ['table_header' => 'total_female', 'table_new_data' => $request->total_female, 'type' => 'int'],
                "27" => ['table_header' => 'total_kk', 'table_new_data' => $request->total_kk, 'type' => 'int'],
                "28" => ['table_header' => 'photo_road_access', 'table_new_data' => $request->photo_road_access, 'type' => 'string'],
                "29" => ['table_header' => 'photo_meeting', 'table_new_data' => $request->photo_meeting, 'type' => 'string'],
                "30" => ['table_header' => 'photo_dry_land', 'table_new_data' => $request->photo_dry_land, 'type' => 'string'],
                "31" => ['table_header' => 'village_profile', 'table_new_data' => $request->village_profile, 'type' => 'string'],
                "32" => ['table_header' => 'status', 'table_new_data' => $request->status, 'type' => 'string'],
                // "33" => ['table_header' => 'complete_data',         'table_new_data' => $request->complete_data,    'type' => 'int'],
                "33" => ['table_header' => 'project_id', 'table_new_data' => $request->project_id, 'type' => 'int'],

                // "35" => ['table_header' => 'is_dell',               'table_new_data' => 0,                          'type' => 'int'],
                "34" => ['table_header' => 'user_id', 'table_new_data' => $request->user_email, 'type' => 'string'],

                "35" => ['table_header' => 'updated_by', 'table_new_data' => Auth::user()->email, 'type' => 'string'],
                "36" => ['table_header' => 'updated_at', 'table_new_data' => Carbon::now()],
                "37" => ['table_header' => 'program_year', 'table_new_data' => $request->program_year, 'type' => 'int'],
                "38" => ['table_header' => 'potential_status', 'table_new_data' => $request->potential_status, 'type' => 'int'],
                "39" => ['table_header' => 'potential_status_description', 'table_new_data' => $request->potential_status_description, 'type' => 'string'],

                "40" => ['table_header' => 'other_ngo', 'table_new_data' => $request->other_ngo, 'type' => 'string'],
                "41" => ['table_header' => 'resident_acceptance', 'table_new_data' => $request->resident_acceptance, 'type' => 'string'],
                "42" => ['table_header' => 'next_event_contact_person', 'table_new_data' => $request->next_event_contact_person, 'type' => 'string'],
                "43" => ['table_header' => 'general_land_condition', 'table_new_data' => $request->general_land_condition, 'type' => 'string'],
                "44" => ['table_header' => 'field_companion_potency', 'table_new_data' => $request->field_companion_potency, 'type' => 'string'],
                "45" => ['table_header' => 'ff_candidate', 'table_new_data' => $request->ff_candidate, 'type' => 'string'],
            ];


            $datas = $this->dynamicUpdate([
                'current_id' => $current_id,
                'tableName' => $tableName,
                'inputData' => $updateDatas,
            ]);

            $result = DB::update($datas);
            return response()->json([
                'result' => $result,
                'sql' => $datas
            ], 200);

        }
    }
    public function UpdateScoopingVisitFigures_new(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'current_id' => 'required',
            'data_no' => 'required',
            'name' => 'required',
            'position' => 'required',
            'phone' => 'required',
            'whatsapp' => 'required',
        ]);
        if ($validator->fails()) {
            $rslt = $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        } else {
            $current_id = $request->current_id;
            $tableName = 'scooping_visit_figures';
            $updateDatas = [
                "0" => ['table_header' => 'data_no', 'table_new_data' => $request->data_no, 'type' => 'string'],
                "1" => ['table_header' => 'name', 'table_new_data' => $request->name, 'type' => 'string'],
                "2" => ['table_header' => 'position', 'table_new_data' => $request->position, 'type' => 'string'],
                "3" => ['table_header' => 'phone', 'table_new_data' => $request->phone, 'type' => 'string'],
                "4" => ['table_header' => 'whatsapp', 'table_new_data' => $request->whatsapp, 'type' => 'string'],
                "6" => ['table_header' => 'updated_at', 'table_new_data' => Carbon::now()]
            ];

            $datas = $this->DynamicUpdate([
                'current_id' => $current_id,
                'tableName' => $tableName,
                'inputData' => $updateDatas,
            ]);

            $result = DB::update($datas);
            return response()->json([
                'result' => $result,
                'sql' => $datas,
            ], 200);

        }
    }
    public function UpdateScoopingVisitProject_new(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'current_id' => 'required',
            'data_no' => 'required',
            'project_id' => 'required',
        ]);
        if ($validator->fails()) {
            $rslt = $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        } else {
            $current_id = $request->current_id;
            $tableName = 'scooping_visit_projects';
            $updateDatas = [
                "0" => ['table_header' => 'scooping_id', 'table_new_data' => $request->data_no, 'type' => 'string'],
                "1" => ['table_header' => 'id_project', 'table_new_data' => $request->project_id, 'type' => 'int'],
                "2" => ['table_header' => 'updated_at', 'table_new_data' => Carbon::now()]
            ];

            $datas = $this->DynamicUpdate([
                'current_id' => $current_id,
                'tableName' => $tableName,
                'inputData' => $updateDatas,
            ]);

            $result = DB::update($datas);
            return response()->json([
                'result' => $result,
                'sql' => $datas,
            ], 200);

        }
    }

    public function GetDetailScoopingVisit_new(Request $request)
    {
        $detail_id = $request->id;
        $req = $request->all();
        $tableName = "scooping_visits";
        $tableAlias = "A";


        $field = [
            '*'
        ];

        $relation = [
            "province" => [
                "reference_table" => "provinces",
                "table_alias" => "B",
                "reference_column" => "province_code",
                "display" => ['id', 'province_code', 'name']
            ],
            "city" => [
                "reference_table" => "kabupatens",
                "table_alias" => "C",
                "reference_column" => "kabupaten_no",
                "display" => ['id', 'kabupaten_no', 'name']
            ],
            "district" => [
                "reference_table" => "kecamatans",
                "table_alias" => "D",
                "reference_column" => "kode_kecamatan",
                "display" => ['id', 'kode_kecamatan', 'name']
            ],
            "village" => [
                "reference_table" => "desas",
                "table_alias" => "E",
                "reference_column" => "kode_desa",
                "display" => ['id', 'kode_desa', 'name']
            ],
            "project_id" => [
                "reference_table" => "projects",
                "table_alias" => "F",
                "reference_column" => "id",
                "display" => ['id', 'project_no', 'project_name']
            ],
            "project_planting_purpose_id" => [
                "reference_table" => "project_planting_purposes",
                "table_alias" => "G",
                "reference_column" => "id",
                "display" => ['id', 'code', 'name'],
                "origin_table" => "F"
            ],
            "project_planting_type_id" => [
                "reference_table" => "project_types",
                "table_alias" => "H",
                "reference_column" => "id",
                "display" => ['id', 'code', 'name'],
                "origin_table" => "F"
            ],
        ];

        $query = $this->DynamicDetail([
            'detail_id' => $detail_id,
            'tableName' => $tableName,
            'tableAlias' => $tableAlias,
            'field' => $field,
            'relation' => $relation,
            'req' => $req
        ]);


        $result = DB::selectOne($query);

        return response()->json([
            'data' => $result,
        ], 200);
    }
    public function GetDetailScoopingVisitFigures_new(Request $request)
    {
        $id = $request->data_no;

        $req = $request->all();
        $searchValue = $request->search_value;
        $searchable = ['data_no', 'name'];
        $filterable = ['data_no', 'position'];
        $sortable = ['id', 'data_no'];
        $tableName = "scooping_visit_figures";
        $tableAlias = "A";
        $limit = 10;
        $offset = 0;
        $field = [
            '*'
        ];

        $relation = [
        ];
        $condition = [
            "data_no" => [
                "conditional_table" => "scooping_visit_figures",
                "conditional_table_alias" => "A",
                "conditional_param" => "=",
                "conditional_value" => "'" . $request->data_no . "'",
            ]
        ];

        $query = $this->DynamicList([
            'tableName' => $tableName,
            'tableAlias' => $tableAlias,
            'limit' => $limit,
            'offset' => $offset,
            'field' => $field,
            'sortable' => $sortable,
            'filterable' => $filterable,
            'relation' => $relation,
            'searchable' => $searchable,
            'search' => $searchValue,
            'condition' => $condition,
            'req' => $req
        ]);

        $result = DB::select($query['sql']);
        $result_record = DB::select($query['sql_record']);

        return response()->json([
            'data' => $result,
            'sql' => $query['sql'],
            'total' => $result_record[0]->total
        ], 200);
    }
    public function GetDetailScoopingVisitNGOCompetitor_new(Request $request)
    {
        $id = $request->scooping_data_no;

        $req = $request->all();
        $searchValue = $request->search_value;
        $searchable = ['scooping_id', 'competitor_name'];
        $filterable = ['scooping_id'];
        $sortable = ['id', 'scooping_id'];
        $tableName = "scooping_visit_ngo_competitor";
        $tableAlias = "A";
        $limit = 10;
        $offset = 0;
        $field = [
            '*'
        ];

        $relation = [
        ];
        $condition = [
            "scooping_data_no" => [
                "conditional_table" => "scooping_visit_ngo_competitor",
                "conditional_table_alias" => "A",
                "conditional_param" => "=",
                "conditional_value" => "'" . $request->scooping_data_no . "'"
            ],
            "is_del" => [
                "conditional_table" => "scooping_visit_ngo_competitor",
                "conditional_table_alias" => "A",
                "conditional_param" => "=",
                "conditional_value" => "0",
            ]
        ];

        $query = $this->DynamicList([
            'tableName' => $tableName,
            'tableAlias' => $tableAlias,
            'limit' => $limit,
            'offset' => $offset,
            'field' => $field,
            'sortable' => $sortable,
            'filterable' => $filterable,
            'relation' => $relation,
            'searchable' => $searchable,
            'search' => $searchValue,
            'condition' => $condition,
            'req' => $req
        ]);

        $result = DB::select($query['sql']);
        $result_record = DB::select($query['sql_record']);

        return response()->json([
            'data' => $result,
            'sql' => $query['sql'],
            'total' => $result_record[0]->total
        ], 200);
    }
    public function GetDetailScoopingVistiProject_new(Request $request)
    {
        $id = $request->scooping_data_no;

        $req = $request->all();
        $searchValue = $request->search_value;
        $searchable = ['scooping_id', 'id_project'];
        $filterable = ['scooping_id'];
        $sortable = ['id', 'scooping_id', 'id_project'];
        $tableName = "scooping_visit_projects";
        $tableAlias = "A";
        $limit = 10;
        $offset = 0;
        $field = [
            '*'
        ];

        $relation = [
            "id_project" => [
                "reference_table" => "projects",
                "table_alias" => "B",
                "reference_column" => "id",
                "display" => ['id', 'project_no', 'project_name', 'project_date', 'end_project', 'note', 'location', 'total_trees', 'co2_capture', 'project_period', 'year_interval', 'active'],
            ],
            "donors" => [
                "reference_table" => "participants",
                "table_alias" => "C",
                "reference_column" => "id",
                "display" => ['id', 'participant_no', 'participant_category', 'first_name', 'last_name', 'address1', 'address2', 'company', 'city', 'state', 'postal_code', 'country', 'email', 'website', 'phone'],
                "origin_table" => "B"
            ],
            "project_planting_type_id" => [
                "reference_table" => "project_types",
                "table_alias" => "D",
                "reference_column" => "id",
                "display" => ['id', 'code', 'name'],
                "origin_table" => "B"
            ],
            "project_planting_purpose_id" => [
                "reference_table" => "project_planting_purposes",
                "table_alias" => "E",
                "reference_column" => "id",
                "display" => ['id', 'code', 'name'],
                "origin_table" => "B"
            ],
            "project_planting_environment_id" => [
                "reference_table" => "project_planting_environments",
                "table_alias" => "F",
                "reference_column" => "id",
                "display" => ['id', 'code', 'name'],
                "origin_table" => "B"
            ],
        ];
        $condition = [
            "scooping_id" => [
                "conditional_table" => "scooping_visit_projects",
                "conditional_table_alias" => "A",
                "conditional_param" => "=",
                "conditional_value" => "'" . $request->data_no . "'"
            ],
            "is_del" => [
                "conditional_table" => "scooping_visit_projects",
                "conditional_table_alias" => "A",
                "conditional_param" => "=",
                "conditional_value" => "0",
            ]
        ];

        $query = $this->DynamicList([
            'tableName' => $tableName,
            'tableAlias' => $tableAlias,
            'limit' => $limit,
            'offset' => $offset,
            'field' => $field,
            'sortable' => $sortable,
            'filterable' => $filterable,
            'relation' => $relation,
            'searchable' => $searchable,
            'search' => $searchValue,
            'condition' => $condition,
            'req' => $req
        ]);

        $result = DB::select($query['sql']);
        $result_record = DB::select($query['sql_record']);

        return response()->json([
            'data' => $result,
            'sql' => $query['sql'],
            'total' => $result_record[0]->total
        ], 200);
    }

    public function UpdateVerifScoopingVisit_new(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'current_id' => 'required',
            'verificator_email' => 'required',
            'potential_status' => 'required'
        ]);
        if ($validator->fails()) {
            $rslt = $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        } else {
            $current_id = $request->current_id;
            $tableName = 'scooping_visits';
            $getVerificationStatus = DB::table('scooping_visits')->where(['id' => $current_id])->first();
            if ($getVerificationStatus->is_verify == 1) {
                $updateDatas = [
                    "0" => ['table_header' => 'is_verify', 'table_new_data' => '2', 'type' => 'string'],
                    "1" => ['table_header' => 'verified_by', 'table_new_data' => $request->verificator_email, 'type' => 'string'],
                    "2" => ['table_header' => 'verified_at', 'table_new_data' => Carbon::now()],
                    "3" => ['table_header' => 'status', 'table_new_data' => 'submit_review', 'type' => 'string'],
                    "4" => ['table_header' => 'potential_status', 'table_new_data' => $request->potential_status, 'type' => 'string'],
                ];
            } else if ($getVerificationStatus->is_verify == 2) {
                $updateDatas = [
                    "0" => ['table_header' => 'is_verify', 'table_new_data' => '1', 'type' => 'string'],
                    "1" => ['table_header' => 'verified_by', 'table_new_data' => 'NULL', 'type' => 'string'],
                    "2" => ['table_header' => 'verified_at', 'table_new_data' => 'NULL'],
                    "3" => ['table_header' => 'status', 'table_new_data' => 'ready_to_submit', 'type' => 'string'],
                    "4" => ['table_header' => 'potential_status', 'table_new_data' => '0', 'type' => 'string'],
                ];
            }
            $datas = $this->DynamicUpdate([
                'current_id' => $current_id,
                'tableName' => $tableName,
                'inputData' => $updateDatas,
            ]);

            $result = DB::update($datas);
            return response()->json([
                'result' => $result,
                'sql' => $datas,
            ], 200);

        }
    }
    public function UpdateVerifScoopingVisitGIS_new(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'current_id' => 'required',
            'verificator_email' => 'required',
            'dry_land_area' => 'required',
        ]);
        if ($validator->fails()) {
            $rslt = $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        } else {
            $current_id = $request->current_id;
            $tableName = 'scooping_visits';
            $getVerificationStatus = DB::table('scooping_visits')->where(['id' => $current_id])->first();
            if ($getVerificationStatus->is_verify == 0) {
                $updateDatas = [
                    "0" => ['table_header' => 'gis_officer', 'table_new_data' => $request->verificator_email, 'type' => 'string'],
                    "1" => ['table_header' => 'gis_verify_at', 'table_new_data' => Carbon::now()],
                    "2" => ['table_header' => 'status', 'table_new_data' => 'ready_to_submit', 'type' => 'string'],
                    "3" => ['table_header' => 'is_verify', 'table_new_data' => '1', 'type' => 'int'],
                    "4" => ['table_header' => 'dry_land_area', 'table_new_data' => $request->dry_land_area, 'type' => 'int'],
                    "5" => ['table_header' => 'slope', 'table_new_data' => $request->slope, 'type' => 'string'],
                    "6" => ['table_header' => 'altitude', 'table_new_data' => $request->altitude, 'type' => 'string'],
                    "7" => ['table_header' => 'rainfall', 'table_new_data' => $request->rainfall, 'type' => 'string'],
                    "8" => ['table_header' => 'village_polygon', 'table_new_data' => $request->village_polygon, 'type' => 'string'],
                    "9" => ['table_header' => 'dry_land_polygon', 'table_new_data' => $request->dry_land_polygon, 'type' => 'string'],
                    "10" => ['table_header' => 'land_type', 'table_new_data' => $request->land_type, 'type' => 'string'],
                ];
            } else {
                $updateDatas = [
                    "0" => ['table_header' => 'gis_officer', 'table_new_data' => 'NULL', 'type' => 'string'],
                    "1" => ['table_header' => 'gis_verify_at', 'table_new_data' => 'NULL'],
                    "2" => ['table_header' => 'status', 'table_new_data' => 'document_saving', 'type' => 'string'],
                    "3" => ['table_header' => 'is_verify', 'table_new_data' => '0', 'type' => 'int'],
                ];
            }

            $datas = $this->DynamicUpdate([
                'current_id' => $current_id,
                'tableName' => $tableName,
                'inputData' => $updateDatas,
            ]);

            $result = DB::update($datas);
            return response()->json([
                'result' => $result,
                'sql' => $datas,
            ], 200);

        }
    }

    public function DeleteScoopingVisit_new(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'scooping_no' => 'required',
            'delete_type' => 'required'
        ]);
        if ($validator->fails()) {
            $rslt = $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        } else {
            if ($request->delete_type == 'soft_delete') {
                $softDeleteMain = [
                    "0" => ['table_header' => 'is_dell', 'table_new_data' => '1', 'type' => 'string'],
                ];
                $softDeleteUtils = [
                    "0" => ['table_header' => 'is_del', 'table_new_data' => '1', 'type' => 'string'],
                ];
                $scoopingMainQuery = $this->DynamicUpdate([
                    'current_id' => $request->scooping_no,
                    'tableName' => 'scooping_visits',
                    'inputData' => $softDeleteMain,
                    'other_id_index' => 'data_no',
                    'id_data_type' => 'string'
                ]);
                $scoopingFiguresQuery = $this->DynamicUpdate([
                    'current_id' => $request->scooping_no,
                    'tableName' => 'scooping_visit_figures',
                    'inputData' => $softDeleteUtils,
                    'other_id_index' => 'data_no',
                    'id_data_type' => 'string'
                ]);
                $scoopingNGOQuery = $this->DynamicUpdate([
                    'current_id' => $request->scooping_no,
                    'tableName' => 'scooping_visit_ngo_competitor',
                    'inputData' => $softDeleteUtils,
                    'other_id_index' => 'scooping_data_no',
                    'id_data_type' => 'string'
                ]);
                $scoopingProjectQuery = $this->DynamicUpdate([
                    'current_id' => $request->scooping_no,
                    'tableName' => 'scooping_visit_projects',
                    'inputData' => $softDeleteUtils,
                    'other_id_index' => 'scooping_id',
                    'id_data_type' => 'string'
                ]);


                $scoopingMainResult = DB::update($scoopingMainQuery);
                $scoopingFiguresResult = DB::update($scoopingFiguresQuery);
                $scoopingNGOResult = DB::update($scoopingNGOQuery);
                $scoopingProjectResult = DB::update($scoopingProjectQuery);

                return response()->json([
                    'mainResult' => $scoopingMainResult,
                    'figuresResult' => $scoopingFiguresResult,
                    'NGOResult' => $scoopingNGOResult,
                    'projectResult' => $scoopingProjectResult,
                ], 200);

            } else if ($request->delete_type == 'hard_delete') {
                $mainScoopingQuery = $this->DynamicDelete([
                    'current_id' => $request->scooping_no,
                    'tableName' => 'scooping_visits',
                    'other_id_index' => 'data_no',
                    'index_data_type' => 'string'
                ]);
                $ScoopingFiguresQuery = $this->DynamicDelete([
                    'current_id' => $request->scooping_no,
                    'tableName' => 'scooping_visit_figures',
                    'other_id_index' => 'data_no',
                    'index_data_type' => 'string'
                ]);
                $ScoopingNGOQuery = $this->DynamicDelete([
                    'current_id' => $request->scooping_no,
                    'tableName' => 'scooping_visit_ngo_competitor',
                    'other_id_index' => 'scooping_data_no',
                    'index_data_type' => 'string'
                ]);
                $ScoopingProjectQuery = $this->DynamicDelete([
                    'current_id' => $request->scooping_no,
                    'tableName' => 'scooping_visit_projects',
                    'other_id_index' => 'scooping_id',
                    'index_data_type' => 'string'
                ]);

                $MainResult = DB::delete($mainScoopingQuery);
                $FiguresResult = DB::delete($ScoopingFiguresQuery);
                $NGOResult = DB::delete($ScoopingNGOQuery);
                $ProjectResult = DB::delete($ScoopingProjectQuery);

                return response()->json([
                    'main_result' => $MainResult,
                    'figures_result' => $FiguresResult,
                    'ngo_result' => $NGOResult,
                    'project_result' => $ProjectResult,
                ], 200);

            }
        }
    }
    public function DeleteScoopingVisitFigures_new(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'delete_type' => 'required'
        ]);
        if ($validator->fails()) {
            $rslt = $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        } else {
            $tableName = 'scooping_visit_figures';
            if ($request->delete_type == 'soft_delete') {
                $softDelete = [
                    "0" => ['table_header' => 'is_del', 'table_new_data' => '1', 'type' => 'int'],
                ];
                $datas = $this->DynamicUpdate([
                    'current_id' => $request->id,
                    'tableName' => $tableName,
                    'inputData' => $softDelete,
                ]);

                $result = DB::update($datas);
                return response()->json([
                    'result' => $result,
                    'sql' => $datas,
                ], 200);

            } else if ($request->delete_type == 'hard_delete') {
                $datas = $this->DynamicDelete([
                    'current_id' => $request->id,
                    'tableName' => $tableName,
                ]);
                $result = DB::delete($datas);
                return response()->json([
                    'result' => $result,
                    'sql' => $datas
                ], 200);

            }
        }
    }
    public function DeleteScoopingVisitProject_new(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'delete_type' => 'required'
        ]);
        if ($validator->fails()) {
            $rslt = $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        } else {
            $tableName = 'scooping_visit_projects';
            if ($request->delete_type == 'soft_delete') {
                $softDelete = [
                    "0" => ['table_header' => 'is_del', 'table_new_data' => '1', 'type' => 'int'],
                ];
                $datas = $this->DynamicUpdate([
                    'current_id' => $request->id,
                    'tableName' => $tableName,
                    'inputData' => $softDelete,
                ]);

                $result = DB::update($datas);
                return response()->json([
                    'result' => $result,
                    'sql' => $datas,
                ], 200);

            } else if ($request->delete_type == 'hard_delete') {
                $datas = $this->DynamicDelete([
                    'current_id' => $request->id,
                    'tableName' => $tableName,
                ]);
                $result = DB::delete($datas);
                return response()->json([
                    'result' => $result,
                    'sql' => $datas
                ], 200);

            }
        }
    }

    // RRA-PRA
    public function GetNewRraPraAll(Request $request)
    {
        $limit = isset($request->limit) ? $request->limit : 10;
        $offset = isset($request->offset) ? $request->offset : 10;
        $sql = "
            SELECT
                A.data_no as scooping_visit_code,
                A.program_year,
                C.id,
                B.name as village_name,
                B.kode_desa as village_code,
                CASE WHEN C.id IS NOT NULL THEN true ELSE false END as rra,
                C.rra_no as rra_code,
                C.rra_pra_date_start,
                C.rra_pra_date_end,
                CASE WHEN D.id IS NOT NULL THEN true ELSE false END as pra,
                D.pra_no as pras,
                CASE WHEN C.status IS NOT NULL
                    THEN C.status
                    ELSE D.status
                END as status,
                CASE WHEN C.is_verify IS NOT NULL
                    THEN C.is_verify
                    ELSE D.is_verify
                END as is_verify,
                CASE WHEN C.user_id IS NOT NULL
                    THEN C.user_id
                    ELSE D.user_id
                END as user_email,
                DE.email as user_email,
                DE.name as user_name,
                G.name as pic_manager_name,
                G.email as pic_manager_email,
                H.project_name,
                H.project_no as project_code,
                H.project_planting_purpose_id
            FROM scooping_visits A
            INNER JOIN desas B on B.kode_desa = A.village
            LEFT JOIN rras C on C.form_no = A.data_no AND C.is_dell = 0
            LEFT JOIN pras D on D.form_no = A.data_no AND D.is_dell = 0
            LEFT JOIN users DE on DE.email = C.user_id OR DE.email = D.user_id
            LEFT JOIN employees E on E.nik = DE.employee_no
            LEFT JOIN employee_structure F on F.nik = E.nik
            LEFT JOIN employees G on G.nik = F.manager_code
            LEFT JOIN projects H on H.id = A.project_id
            WHERE C.id IS NOT NULL or D.id IS NOT NULL
            ORDER BY CASE WHEN C.id IS NOT NULL THEN C.id ELSE D.id END DESC
            LIMIT " . $limit . " OFFSET " . $offset . "
        ";

        $sqlRecord = "
            SELECT
                COUNT(A.id) AS total_data,
                SUM(CASE WHEN C.status = 'document_saving' AND (C.id IS NOT NULL OR D.id IS NOT NULL) OR D.status = 'document_saving' THEN 1 ELSE 0 END) as unverified,
                SUM(CASE WHEN C.status = 'submit_review' OR D.status = 'submit_review' THEN 1 ELSE 0 END) as verified,
                SUM(CASE WHEN C.id IS NULL OR D.id IS NULL THEN 1 ELSE 0 END) as uncomplete
            FROM scooping_visits A
            LEFT JOIN rras C on C.form_no = A.data_no AND C.is_dell = 0
            LEFT JOIN pras D on D.form_no = A.data_no AND D.is_dell = 0
            WHERE C.id IS NOT NULL or D.id IS NOT NULL
        ";
        $result = DB::select($sql);
        $totalRecord = DB::select($sqlRecord);
        return [
            'data' => $result,
            'count' => $totalRecord[0],
            'total' => $totalRecord[0]->total_data
        ];
    }
    public function GetRraAll_new(Request $request)
    {
        $employeeUser = $this->getFCListByUserUMPY();
        $req = $request->all();
        $searchValue = $request->search_value;
        $searchable = ['rra_no', 'form_no', 'village'];
        $filterable = [
            'code' => [
                'request_value' => $request->purpose_code,
                'table_alias' => 'H',
                'operator' => '='
            ]
            // 'program_year' => [
            //         'request_value' => $request->program_year,
            //         'table_alias' => 'A',
            //         'operator' => '='
            //     ],
        ];
        $sortable = ['id', 'rra_no', 'form_no', 'rra_pra_date_start', 'rra_pra_date_end'];
        $tableName = "rras";
        $tableAlias = "A";
        $limit = isset($req['limit']) ? $req['limit'] : 10;
        $offset = isset($req['offset']) ? $req['offset'] : 0;
        $field = [
            'id',
            'form_no',
            'village',
            'rra_pra_date_start',
            'rra_pra_date_end',
            'user_id',
            'verified_by',
            'is_verify',
            'created_at',
            'status',
        ];

        $relation = [
            "village" => [
                "reference_table" => "desas",
                "table_alias" => "B",
                "reference_column" => "kode_desa",
                "display" => ['id', 'kode_desa', 'name'],
            ],
            "user_id" => [
                "reference_table" => "users",
                "table_alias" => "C",
                "reference_column" => "email",
                "display" => ['id', 'name'],
            ],
            "employee_no" => [
                "reference_table" => "employee_structure",
                "table_alias" => "D",
                "reference_column" => "nik",
                "display" => ['id', 'manager_code'],
                "origin_table" => "C"
            ],
            "manager_code" => [
                "reference_table" => "employees",
                "table_alias" => "E",
                "reference_column" => "nik",
                "display" => ['id', 'name'],
                "origin_table" => "D"
            ],
            "form_no" => [
                "reference_table" => "scooping_visits",
                "table_alias" => "F",
                "reference_column" => "data_no",
                "display" => ['id', 'data_no', 'project_id'],
            ],
            "project_id" => [
                "reference_table" => "projects",
                "table_alias" => "G",
                "reference_column" => "id",
                "display" => ['id', 'project_no', 'project_name'],
                "origin_table" => "F"
            ],
            "project_planting_purpose_id" => [
                "reference_table" => "project_planting_purposes",
                "table_alias" => "H",
                "reference_column" => "id",
                "display" => ['id', 'code', 'name'],
                "origin_table" => "G"
            ],
        ];
        $condition = [
            "is_dell" => [
                "conditional_table" => "rras",
                "conditional_table_alias" => "A",
                "conditional_column" => "is_dell",
                "conditional_param" => "=",
                "conditional_value" => '0',
            ],
        ];
        $user_id = [
            "user_id" => [
                "listId" => $employeeUser
            ],
        ];


        $query = $this->DynamicList([
            'tableName' => $tableName,
            'tableAlias' => $tableAlias,
            'limit' => $limit,
            'offset' => $offset,
            'field' => $field,
            'sortable' => $sortable,
            'filterable' => $filterable,
            'relation' => $relation,
            'searchable' => $searchable,
            'search' => $searchValue,
            'condition' => $condition,
            'req' => $req,
            'users_id' => $user_id
        ]);

        $statistic = $this->DynamicCount([
            'tableName' => $tableName,
            'indicator_column' => 'is_verify',
            'users_id' => $user_id,
            'condition' => $condition,
            'filterable' => $filterable,
        ]);

        $result = DB::select($query['sql']);
        $result_record = DB::select($query['sql_record']);
        $rslt = DB::select($statistic);

        return response()->json([
            'data' => $result,
            'count' => $rslt[0],
            'sql' => $query['sql'],
            'total' => $result_record[0]->total
        ], 200);
    }

    public function GetDetailRraPra_new(Request $request)
    {
        $detail_id = $request->id;
        $req = $request->all();

        $field = ['*'];
        $poly_id = DB::table('rras')->where(['id' => $detail_id])->pluck('form_no')->implode('');
        $rra_no = DB::table('rras')->where(['id' => $detail_id])->pluck('rra_no')->implode('');
        $pra_no = DB::table('pras')->where(['form_no' => $poly_id])->pluck('pra_no')->implode('');
        // return response()->json($pra_no);

        // Scooping
        $scooping_realtion = [
            "village" => [
                "reference_table" => "desas",
                "table_alias" => "C",
                "reference_column" => "kode_desa",
                "display" => ['id', 'kode_desa', 'name', 'post_code']
            ]
        ];
        // RRA 
        $rra_village_border_relation = [
            "kode_desa" => [
                "reference_table" => "desas",
                "table_alias" => "B",
                "reference_column" => "kode_desa",
                "display" => ['id', 'kode_desa', 'name', 'post_code']
            ],
            "kabupaten_no" => [
                "reference_table" => "kabupatens",
                "table_alias" => "C",
                "reference_column" => "kabupaten_no",
                "display" => ['id', 'kabupaten_no', 'name']
            ],
            "kode_kecamatan" => [
                "reference_table" => "kecamatans",
                "table_alias" => "D",
                "reference_column" => "kode_kecamatan",
                "display" => ['id', 'kode_kecamatan', 'name']
            ],

        ];
        $scooping_query = $this->DynamicDetail([
            'sourceColumn' => 'data_no',
            'id_type' => 'string',
            'detail_id' => $poly_id,
            'tableName' => 'scooping_visits',
            'tableAlias' => 'B',
            'field' => $field,
            'relation' => $scooping_realtion,
            'req' => $req
        ]);
        //RRA
        $rra_query = $this->DynamicDetail([
            'detail_id' => $detail_id,
            'tableName' => 'rras',
            'tableAlias' => 'A',
            'field' => $field,
            'req' => $req
        ]);
        $rra_VillageBorderQuery = $this->DynamicDetail([
            'sourceColumn' => 'rra_no',
            'id_type' => 'string',
            'detail_id' => $rra_no,
            'tableName' => 'village_borders',
            'relation' => $rra_village_border_relation,
            'tableAlias' => 'A',
            'field' => $field,
            'req' => $req
        ]);
        $rra_LandUseQuery = $this->DynamicDetail([
            'sourceColumn' => 'rra_no',
            'id_type' => 'string',
            'detail_id' => $rra_no,
            'tableName' => 'rra_land_uses',
            'tableAlias' => 'A',
            'field' => $field,
            'req' => $req
        ]);
        $rra_ExistingPlantQuery = $this->DynamicDetail([
            'sourceColumn' => 'rra_no',
            'id_type' => 'string',
            'detail_id' => $rra_no,
            'tableName' => 'rra_existing_plants',
            'tableAlias' => 'A',
            'field' => $field,
            'req' => $req
        ]);
        $rra_ComunityInstitutionQuery = $this->DynamicDetail([
            'sourceColumn' => 'rra_no',
            'id_type' => 'string',
            'detail_id' => $rra_no,
            'tableName' => 'rra_community_institutions',
            'tableAlias' => 'A',
            'field' => $field,
            'req' => $req
        ]);
        $rra_OrganicPotentialsQuery = $this->DynamicDetail([
            'sourceColumn' => 'rra_no',
            'id_type' => 'string',
            'detail_id' => $rra_no,
            'tableName' => 'rra_organic_potentials',
            'tableAlias' => 'A',
            'field' => $field,
            'req' => $req
        ]);
        $rra_ProductionMarketingQuery = $this->DynamicDetail([
            'sourceColumn' => 'rra_no',
            'id_type' => 'string',
            'detail_id' => $rra_no,
            'tableName' => 'rra_production_marketings',
            'tableAlias' => 'A',
            'field' => $field,
            'req' => $req
        ]);
        $rra_InnovativeFarmersQuery = $this->DynamicDetail([
            'sourceColumn' => 'rra_no',
            'id_type' => 'string',
            'detail_id' => $rra_no,
            'tableName' => 'rra_innovative_farmers',
            'tableAlias' => 'A',
            'field' => $field,
            'req' => $req
        ]);
        $rra_DusunQuery = $this->DynamicDetail([
            'sourceColumn' => 'rra_no',
            'id_type' => 'string',
            'detail_id' => $rra_no,
            'tableName' => 'rra_dusuns',
            'tableAlias' => 'A',
            'field' => $field,
            'req' => $req
        ]);

        //PRA
        $pra_query = $this->DynamicDetail([
            'sourceColumn' => 'form_no',
            'id_type' => 'string',
            'detail_id' => $poly_id,
            'tableName' => 'pras',
            'tableAlias' => 'C',
            'field' => $field,
            'req' => $req
        ]);
        $pra_DisasterDetailQuery = $this->DynamicDetail([
            'sourceColumn' => 'pra_no',
            'id_type' => 'string',
            'detail_id' => $pra_no,
            'tableName' => 'pra_disaster_details',
            'tableAlias' => 'C',
            'field' => $field,
            'req' => $req
        ]);
        $pra_FertilizerDetailQuery = $this->DynamicDetail([
            'sourceColumn' => 'pra_no',
            'id_type' => 'string',
            'detail_id' => $pra_no,
            'tableName' => 'pra_fertilizer_details',
            'tableAlias' => 'C',
            'field' => $field,
            'req' => $req
        ]);
        $pra_PesticideDetailQuery = $this->DynamicDetail([
            'sourceColumn' => 'pra_no',
            'id_type' => 'string',
            'detail_id' => $pra_no,
            'tableName' => 'pra_pesticide_details',
            'tableAlias' => 'C',
            'field' => $field,
            'req' => $req
        ]);
        $pra_DryLandSpreadsQuery = $this->DynamicDetail([
            'sourceColumn' => 'pra_no',
            'id_type' => 'string',
            'detail_id' => $pra_no,
            'tableName' => 'pra_dry_land_spreads',
            'tableAlias' => 'C',
            'field' => $field,
            'req' => $req
        ]);
        $pra_LandOwnershipQuery = $this->DynamicDetail([
            'sourceColumn' => 'pra_no',
            'id_type' => 'string',
            'detail_id' => $pra_no,
            'tableName' => 'pra_land_ownerships',
            'tableAlias' => 'C',
            'field' => $field,
            'req' => $req
        ]);
        $pra_WaterSourceQuery = $this->DynamicDetail([
            'sourceColumn' => 'pra_no',
            'id_type' => 'string',
            'detail_id' => $pra_no,
            'tableName' => 'pra_watersource_details',
            'tableAlias' => 'C',
            'field' => $field,
            'req' => $req
        ]);
        $pra_ExistingProblemQuery = $this->DynamicDetail([
            'sourceColumn' => 'pra_no',
            'id_type' => 'string',
            'detail_id' => $pra_no,
            'tableName' => 'pra_existing_problems',
            'tableAlias' => 'C',
            'field' => $field,
            'req' => $req
        ]);
        $pra_FarmerIncomeQuery = $this->DynamicDetail([
            'sourceColumn' => 'pra_no',
            'id_type' => 'string',
            'detail_id' => $pra_no,
            'tableName' => 'pra_farmer_incomes',
            'tableAlias' => 'C',
            'field' => $field,
            'req' => $req
        ]);
        $pra_SocialImpactFaunaQuery = $this->DynamicDetail([
            'sourceColumn' => 'pra_no',
            'id_type' => 'string',
            'detail_id' => $pra_no,
            'tableName' => 'socialimpact_fauna_details',
            'tableAlias' => 'C',
            'field' => $field,
            'req' => $req
        ]);
        $pra_SocialImpactFloraQuery = $this->DynamicDetail([
            'sourceColumn' => 'pra_no',
            'id_type' => 'string',
            'detail_id' => $pra_no,
            'tableName' => 'socialimpact_flora_details',
            'tableAlias' => 'C',
            'field' => $field,
            'req' => $req
        ]);




        $scooping_details = DB::selectOne($scooping_query);
        // rra
        $rra_details = DB::selectOne($rra_query);
        $rra_village_border_details = DB::select($rra_VillageBorderQuery);
        $rra_land_use_details = DB::select($rra_LandUseQuery);
        $rra_existing_plant_details = DB::select($rra_ExistingPlantQuery);
        $rra_comunity_institution_details = DB::select($rra_ComunityInstitutionQuery);
        $rra_organic_potentials_details = DB::select($rra_OrganicPotentialsQuery);
        $rra_production_marketing_details = DB::select($rra_ProductionMarketingQuery);
        $rra_innovative_farmer_details = DB::select($rra_InnovativeFarmersQuery);
        $rra_dusun_details = DB::select($rra_DusunQuery);
        // pra
        $pra_details = DB::selectOne($pra_query);
        $pra_disaster_details = DB::select($pra_DisasterDetailQuery);
        $pra_fertilizer_details = DB::select($pra_FertilizerDetailQuery);
        $pra_pesticide_details = DB::select($pra_PesticideDetailQuery);
        $pra_dry_land_spreads_details = DB::select($pra_DryLandSpreadsQuery);
        $pra_land_ownership_details = DB::select($pra_LandOwnershipQuery);
        $pra_water_source_details = DB::select($pra_WaterSourceQuery);
        $pra_existing_problem_details = DB::select($pra_ExistingProblemQuery);
        $pra_farmer_income_details = DB::select($pra_FarmerIncomeQuery);
        $social_impact_fauna_details = DB::select($pra_SocialImpactFaunaQuery);
        $social_impact_flora_details = DB::select($pra_SocialImpactFloraQuery);


        return response()->json([
            'mainScooping' => $scooping_details,
            'rra' => [
                'mainRra' => $rra_details,
                'RraVillageBorder' => $rra_village_border_details,
                'RralandUse' => $rra_land_use_details,
                'RraExistingPlant' => $rra_existing_plant_details,
                'RraComunityInstitution' => $rra_comunity_institution_details,
                'RraOrganicPotentials' => $rra_organic_potentials_details,
                'RraProductionMarketing' => $rra_production_marketing_details,
                'RraInnovativeFarmer' => $rra_innovative_farmer_details,
                'RraDusun' => $rra_dusun_details,
            ],
            'pra' => [
                'mainPra' => $pra_details,
                'PraDisasterDetail' => $pra_disaster_details,
                'PraFertilizerDetail' => $pra_fertilizer_details,
                'PraPersticideDetail' => $pra_pesticide_details,
                'PraDryLandSpreadDetail' => $pra_dry_land_spreads_details,
                'PraLandOwnershipDetail' => $pra_land_ownership_details,
                'PraWaterSourceDetail' => $pra_water_source_details,
                'PraExistingProblemDetail' => $pra_existing_problem_details,
                'PrafarmerIncomeDetail' => $pra_farmer_income_details,
                'PraSocialImpactFaunaDetail' => $social_impact_fauna_details,
                'PraSocilaImpactFloraDetail' => $social_impact_flora_details,
            ],

        ], 200);
    }

    //add rra
    public function addMainRra_new(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'scooping_form_no' => 'required',
        ]);

        if ($validator->fails()) {
            $rslt = $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        } else {
            $rra_no = Rra::Maxno();
            $pra_no = Pra::Maxno();
            $form_no = $request->scooping_form_no;
            $tableName = 'rras';

            $createDatas = [
                "0" => ['table_header' => 'rra_no', 'table_new_data' => $rra_no, 'type' => 'string'],
                "1" => ['table_header' => 'form_no', 'table_new_data' => $form_no, 'type' => 'string'],
                "2" => ['table_header' => 'rra_pra_date_start', 'table_new_data' => $request->rra_pra_date_start, 'type' => 'string'],
                "3" => ['table_header' => 'rra_pra_date_end', 'table_new_data' => $request->rra_pra_date_end, 'type' => 'string'],
                "4" => ['table_header' => 'village', 'table_new_data' => $request->village, 'type' => 'string'],
                "5" => ['table_header' => 'lahan_menurut_masyarakat', 'table_new_data' => $request->lahan_menurut_masyarakat, 'type' => 'string'],
                "6" => ['table_header' => 'tanah_sawah', 'table_new_data' => $request->tanah_sawah, 'type' => 'int'],
                "7" => ['table_header' => 'tegal_ladang', 'table_new_data' => $request->tegal_ladang, 'type' => 'int'],
                "8" => ['table_header' => 'pemukiman', 'table_new_data' => $request->pemukiman, 'type' => 'int'],
                "9" => ['table_header' => 'pekarangan', 'table_new_data' => $request->pekarangan, 'type' => 'int'],
                "10" => ['table_header' => 'tanah_rawa', 'table_new_data' => $request->tanah_rawa, 'type' => 'int'],
                "11" => ['table_header' => 'waduk_danau', 'table_new_data' => $request->waduk_danau, 'type' => 'int'],
                "12" => ['table_header' => 'tanah_perkebunan_rakyat', 'table_new_data' => $request->tanah_perkebunan_rakyat, 'type' => 'int'],
                "13" => ['table_header' => 'tanah_perkebunan_negara', 'table_new_data' => $request->tanah_perkebunan_negara, 'type' => 'int'],
                "14" => ['table_header' => 'tanah_perkebunan_swasta', 'table_new_data' => $request->tanah_perkebunan_swasta, 'type' => 'int'],
                "15" => ['table_header' => 'hutan_lindung', 'table_new_data' => $request->hutan_lindung, 'type' => 'int'],
                "16" => ['table_header' => 'hutan_rakyat', 'table_new_data' => $request->hutan_rakyat, 'type' => 'int'],

                "17" => ['table_header' => 'fasilitas_umum', 'table_new_data' => $request->fasilitas_umum, 'type' => 'int'],
                "18" => ['table_header' => 'commodity_photo', 'table_new_data' => $request->commodity_photo, 'type' => 'string'],
                "19" => ['table_header' => 'institution_photo', 'table_new_data' => $request->institution_photo, 'type' => 'string'],
                "20" => ['table_header' => 'organic_farming_photo', 'table_new_data' => $request->organic_farming_photo, 'type' => 'string'],
                "21" => ['table_header' => 'status', 'table_new_data' => 'document_saving', 'type' => 'string'],

                "22" => ['table_header' => 'complete_data', 'table_new_data' => 0, 'type' => 'string'],
                "23" => ['table_header' => 'is_dell', 'table_new_data' => 0, 'type' => 'string'],
                "24" => ['table_header' => 'user_id', 'table_new_data' => $request->user_id ?? Auth::user()->email ?? '-', 'type' => 'string'],
                "25" => ['table_header' => 'created_at', 'table_new_data' => Carbon::now()],
                "26" => ['table_header' => 'updated_at', 'table_new_data' => Carbon::now()]
            ];

            $datas = $this->dynamicCreate([
                'tableName' => $tableName,
                'inputData' => $createDatas,
            ]);

            $result = DB::insert($datas);
            return response()->json([
                'result' => $result,
                'sql' => $datas,
                'rra_no' => $rra_no,
            ], 200);

        }

    }
    public function addRraVillageBorder_new(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'rra_no' => 'required',
        ]);

        if ($validator->fails()) {
            $rslt = $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        } else {
            $rra_no = $request->rra_no;
            $tableName = 'village_borders';
            $createDatas = [
                "0" => ['table_header' => 'rra_no', 'table_new_data' => $rra_no, 'type' => 'string'],
                "1" => ['table_header' => 'point', 'table_new_data' => $request->point, 'type' => 'string'],
                "2" => ['table_header' => 'border_type', 'table_new_data' => $request->border_type, 'type' => 'string'],
                "3" => ['table_header' => 'kabupaten_no', 'table_new_data' => $request->kabupaten_no, 'type' => 'int'],
                "4" => ['table_header' => 'kode_kecamatan', 'table_new_data' => $request->kode_kecamatan, 'type' => 'string'],
                "5" => ['table_header' => 'kode_desa', 'table_new_data' => $request->kode_desa, 'type' => 'string'],
                "6" => ['table_header' => 'is_del', 'table_new_data' => 0, 'type' => 'int'],
                "7" => ['table_header' => 'created_at', 'table_new_data' => Carbon::now()],
                "8" => ['table_header' => 'updated_at', 'table_new_data' => Carbon::now()]
            ];

            $datas = $this->dynamicCreate([
                'tableName' => $tableName,
                'inputData' => $createDatas,
            ]);

            $result = DB::insert($datas);
            return response()->json([
                'result' => $result,
                'sql' => $datas,
            ], 200);

        }

    }
    public function addRraLandUse_new(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'rra_no' => 'required',
        ]);
        if ($validator->fails()) {
            $rslt = $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        } else {
            $rra_no = $request->rra_no;
            $tableName = 'rra_land_uses';
            $createDatas = [
                "0" => ['table_header' => 'rra_no', 'table_new_data' => $rra_no, 'type' => 'string'],
                "1" => ['table_header' => 'pattern', 'table_new_data' => $request->pattern, 'type' => 'string'],
                "2" => ['table_header' => 'plant', 'table_new_data' => $request->plant, 'type' => 'string'],
                "3" => ['table_header' => 'is_del', 'table_new_data' => 0, 'type' => 'int'],
                "4" => ['table_header' => 'created_at', 'table_new_data' => Carbon::now()],
                "5" => ['table_header' => 'updated_at', 'table_new_data' => Carbon::now()]
            ];

            $datas = $this->dynamicCreate([
                'tableName' => $tableName,
                'inputData' => $createDatas,
            ]);

            $result = DB::insert($datas);
            return response()->json([
                'result' => $result,
                'sql' => $datas,
            ], 200);

        }
    }
    public function addRraExistingPlant_new(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'rra_no' => 'required',
        ]);
        if ($validator->fails()) {
            $rslt = $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        } else {
            $rra_no = $request->rra_no;
            $tableName = 'rra_existing_plants';
            $createDatas = [
                "0" => ['table_header' => 'rra_no', 'table_new_data' => $rra_no, 'type' => 'string'],
                "1" => ['table_header' => 'plant_type', 'table_new_data' => $request->plant_type, 'type' => 'string'],
                "2" => ['table_header' => 'plant', 'table_new_data' => $request->plant, 'type' => 'string'],

                "3" => ['table_header' => 'is_del', 'table_new_data' => 0, 'type' => 'int'],
                "4" => ['table_header' => 'created_at', 'table_new_data' => Carbon::now()],
                "5" => ['table_header' => 'updated_at', 'table_new_data' => Carbon::now()]
            ];

            $datas = $this->dynamicCreate([
                'tableName' => $tableName,
                'inputData' => $createDatas,
            ]);

            $result = DB::insert($datas);
            return response()->json([
                'result' => $result,
                'sql' => $datas,
            ], 200);

        }
    }
    public function addRraComunityInstitution_new(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'rra_no' => 'required',
        ]);
        if ($validator->fails()) {
            $rslt = $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        } else {
            $rra_no = $request->rra_no;
            $tableName = 'rra_community_institutions';
            $createDatas = [
                "0" => ['table_header' => 'rra_no', 'table_new_data' => $rra_no, 'type' => 'string'],
                "1" => ['table_header' => 'institution_name', 'table_new_data' => $request->institution_name, 'type' => 'string'],
                "2" => ['table_header' => 'role', 'table_new_data' => $request->role, 'type' => 'string'],
                "3" => ['table_header' => 'description', 'table_new_data' => $request->description, 'type' => 'string'],

                "4" => ['table_header' => 'is_del', 'table_new_data' => 0, 'type' => 'int'],
                "5" => ['table_header' => 'created_at', 'table_new_data' => Carbon::now()],
                "6" => ['table_header' => 'updated_at', 'table_new_data' => Carbon::now()]
            ];

            $datas = $this->dynamicCreate([
                'tableName' => $tableName,
                'inputData' => $createDatas,
            ]);

            $result = DB::insert($datas);
            return response()->json([
                'result' => $result,
                'sql' => $datas,
            ], 200);

        }
    }
    public function addRraOrganicPotentials_new(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'rra_no' => 'required',
        ]);
        if ($validator->fails()) {
            $rslt = $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        } else {
            $rra_no = $request->rra_no;
            $tableName = 'rra_organic_potentials';
            $createDatas = [
                "0" => ['table_header' => 'rra_no', 'table_new_data' => $rra_no, 'type' => 'string'],
                "1" => ['table_header' => 'potential_category', 'table_new_data' => $request->potential_category, 'type' => 'string'],
                "2" => ['table_header' => 'name', 'table_new_data' => $request->name, 'type' => 'string'],
                "3" => ['table_header' => 'source', 'table_new_data' => $request->source, 'type' => 'string'],
                "4" => ['table_header' => 'description', 'table_new_data' => $request->description, 'type' => 'string'],

                "5" => ['table_header' => 'is_del', 'table_new_data' => 0, 'type' => 'int'],
                "6" => ['table_header' => 'created_at', 'table_new_data' => Carbon::now()],
                "7" => ['table_header' => 'updated_at', 'table_new_data' => Carbon::now()]
            ];

            $datas = $this->dynamicCreate([
                'tableName' => $tableName,
                'inputData' => $createDatas,
            ]);

            $result = DB::insert($datas);
            return response()->json([
                'result' => $result,
                'sql' => $datas,
            ], 200);

        }
    }
    public function addRraProductionMarketing_new(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'rra_no' => 'required',
        ]);
        if ($validator->fails()) {
            $rslt = $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        } else {
            $rra_no = $request->rra_no;
            $tableName = 'rra_production_marketings';
            $createDatas = [
                "0" => ['table_header' => 'rra_no', 'table_new_data' => $rra_no, 'type' => 'string'],
                "1" => ['table_header' => 'commodity_name', 'table_new_data' => $request->commodity_name, 'type' => 'string'],
                "2" => ['table_header' => 'capacity', 'table_new_data' => $request->capacity, 'type' => 'string'],
                "3" => ['table_header' => 'method', 'table_new_data' => $request->method, 'type' => 'string'],
                "4" => ['table_header' => 'period', 'table_new_data' => $request->period, 'type' => 'string'],

                "5" => ['table_header' => 'description', 'table_new_data' => $request->description, 'type' => 'string'],
                "6" => ['table_header' => 'customer', 'table_new_data' => $request->customer, 'type' => 'string'],
                "7" => ['table_header' => 'phone', 'table_new_data' => $request->phone, 'type' => 'string'],
                "8" => ['table_header' => 'email', 'table_new_data' => $request->email, 'type' => 'string'],

                "9" => ['table_header' => 'capacity_switcher', 'table_new_data' => $request->capacity_switcher, 'type' => 'int'],
                "10" => ['table_header' => 'has_customer', 'table_new_data' => $request->has_customer, 'type' => 'int'],

                "11" => ['table_header' => 'is_del', 'table_new_data' => 0, 'type' => 'int'],
                "12" => ['table_header' => 'created_at', 'table_new_data' => Carbon::now()],
                "13" => ['table_header' => 'updated_at', 'table_new_data' => Carbon::now()]
            ];

            $datas = $this->dynamicCreate([
                'tableName' => $tableName,
                'inputData' => $createDatas,
            ]);

            $result = DB::insert($datas);
            return response()->json([
                'result' => $result,
                'sql' => $datas,
            ], 200);

        }
    }
    public function addRraInnovativeFarmer_new(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'rra_no' => 'required',
        ]);
        if ($validator->fails()) {
            $rslt = $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        } else {
            $rra_no = $request->rra_no;
            $tableName = 'rra_innovative_farmers';
            $createDatas = [
                "0" => ['table_header' => 'rra_no', 'table_new_data' => $rra_no, 'type' => 'string'],
                "1" => ['table_header' => 'farmer_name', 'table_new_data' => $request->farmer_name, 'type' => 'string'],
                "2" => ['table_header' => 'specialitation', 'table_new_data' => $request->specialitation, 'type' => 'string'],
                "3" => ['table_header' => 'potential', 'table_new_data' => $request->potential, 'type' => 'string'],
                "4" => ['table_header' => 'description', 'table_new_data' => $request->description, 'type' => 'string'],

                "5" => ['table_header' => 'is_del', 'table_new_data' => 0, 'type' => 'int'],
                "6" => ['table_header' => 'created_at', 'table_new_data' => Carbon::now()],
                "7" => ['table_header' => 'updated_at', 'table_new_data' => Carbon::now()]
            ];

            $datas = $this->dynamicCreate([
                'tableName' => $tableName,
                'inputData' => $createDatas,
            ]);

            $result = DB::insert($datas);
            return response()->json([
                'result' => $result,
                'sql' => $datas,
            ], 200);

        }
    }
    public function addRraDusun_new(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'rra_no' => 'required',
        ]);
        if ($validator->fails()) {
            $rslt = $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        } else {
            $rra_no = $request->rra_no;
            $tableName = 'rra_dusuns';
            $createDatas = [
                "0" => ['table_header' => 'rra_no', 'table_new_data' => $rra_no, 'type' => 'string'],
                "1" => ['table_header' => 'dusun_name', 'table_new_data' => $request->dusun_name, 'type' => 'string'],
                "2" => ['table_header' => 'potential', 'table_new_data' => $request->potential, 'type' => 'int'],
                "3" => ['table_header' => 'land_area', 'table_new_data' => $request->land_area, 'type' => 'int'],
                "4" => ['table_header' => 'accessibility', 'table_new_data' => $request->accessibility, 'type' => 'string'],
                "5" => ['table_header' => 'dry_land_area', 'table_new_data' => $request->dry_land_area, 'type' => 'int'],
                "6" => ['table_header' => 'pic_dusun', 'table_new_data' => $request->pic_dusun, 'type' => 'string'],
                "7" => ['table_header' => 'position', 'table_new_data' => $request->position, 'type' => 'string'],
                "8" => ['table_header' => 'phone', 'table_new_data' => $request->phone, 'type' => 'string'],
                "9" => ['table_header' => 'whatsapp', 'table_new_data' => $request->whatsapp, 'type' => 'string'],
                "10" => ['table_header' => 'total_rw', 'table_new_data' => $request->total_rw, 'type' => 'int'],
                "11" => ['table_header' => 'total_rt', 'table_new_data' => $request->total_rt, 'type' => 'int'],
                "12" => ['table_header' => 'total_male', 'table_new_data' => $request->total_male, 'type' => 'int'],

                "13" => ['table_header' => 'total_female', 'table_new_data' => $request->total_female, 'type' => 'int'],
                "14" => ['table_header' => 'total_kk', 'table_new_data' => $request->total_kk, 'type' => 'int'],
                "15" => ['table_header' => 'total_farmer_family', 'table_new_data' => $request->total_farmer_family, 'type' => 'int'],
                "16" => ['table_header' => 'average_family_member', 'table_new_data' => $request->average_family_member, 'type' => 'int'],
                "17" => ['table_header' => 'average_farmer_family_member', 'table_new_data' => $request->average_farmer_family_member, 'type' => 'int'],
                "18" => ['table_header' => 'education_elementary_junior_hs', 'table_new_data' => $request->education_elementary_junior_hs, 'type' => 'int'],
                "19" => ['table_header' => 'education_senior_hs', 'table_new_data' => $request->education_senior_hs, 'type' => 'int'],
                "20" => ['table_header' => 'education_college', 'table_new_data' => $request->education_college, 'type' => 'int'],
                "21" => ['table_header' => 'age_productive', 'table_new_data' => $request->age_productive, 'type' => 'int'],
                "22" => ['table_header' => 'age_non_productive', 'table_new_data' => $request->age_non_productive, 'type' => 'int'],
                "23" => ['table_header' => 'job_farmer', 'table_new_data' => $request->job_farmer, 'type' => 'int'],
                "24" => ['table_header' => 'job_farm_workers', 'table_new_data' => $request->job_farm_workers, 'type' => 'int'],

                "25" => ['table_header' => 'job_private_employee', 'table_new_data' => $request->job_private_employee, 'type' => 'int'],
                "26" => ['table_header' => 'job_state_employee', 'table_new_data' => $request->job_state_employee, 'type' => 'int'],
                "27" => ['table_header' => 'job_enterpreneur', 'table_new_data' => $request->job_enterpreneur, 'type' => 'int'],
                "28" => ['table_header' => 'job_others', 'table_new_data' => $request->job_others, 'type' => 'int'],
                "29" => ['table_header' => 'dusun_access_photo', 'table_new_data' => $request->dusun_access_photo, 'type' => 'string'],
                "30" => ['table_header' => 'data_land_area_source', 'table_new_data' => $request->data_land_area_source, 'type' => 'string'],
                "31" => ['table_header' => 'data_dry_land_area_source', 'table_new_data' => $request->data_dry_land_area_source, 'type' => 'string'],
                "32" => ['table_header' => 'has_detail_kk', 'table_new_data' => $request->has_detail_kk, 'type' => 'int'],
                "33" => ['table_header' => 'total_non_farmer_family', 'table_new_data' => $request->total_non_farmer_family, 'type' => 'int'],
                "34" => ['table_header' => 'has_avg_member', 'table_new_data' => $request->has_avg_member, 'type' => 'int'],
                "35" => ['table_header' => 'has_detail_avg_member', 'table_new_data' => $request->has_detail_avg_member, 'type' => 'int'],
                "36" => ['table_header' => 'average_non_farmer_family_member', 'table_new_data' => $request->average_non_farmer_family_member, 'type' => 'int'],

                "37" => ['table_header' => 'data_productive_source', 'table_new_data' => $request->data_productive_source, 'type' => 'string'],
                "38" => ['table_header' => 'data_job_source', 'table_new_data' => $request->data_job_source, 'type' => 'string'],
                "39" => ['table_header' => 'job_farmer_switcher', 'table_new_data' => $request->job_farmer_switcher, 'type' => 'int'],
                "40" => ['table_header' => 'job_farm_workers_switcher', 'table_new_data' => $request->job_farm_workers_switcher, 'type' => 'int'],
                "41" => ['table_header' => 'job_private_employee_switcher', 'table_new_data' => $request->job_private_employee_switcher, 'type' => 'int'],
                "42" => ['table_header' => 'job_state_employee_switcher', 'table_new_data' => $request->job_state_employee_switcher, 'type' => 'int'],
                "43" => ['table_header' => 'job_enterpreneur_switcher', 'table_new_data' => $request->job_enterpreneur_switcher, 'type' => 'int'],
                "44" => ['table_header' => 'job_others_switcher', 'table_new_data' => $request->job_others_switcher, 'type' => 'int'],

                "45" => ['table_header' => 'is_del', 'table_new_data' => 0, 'type' => 'int'],
                "46" => ['table_header' => 'created_at', 'table_new_data' => Carbon::now()],
                "47" => ['table_header' => 'updated_at', 'table_new_data' => Carbon::now()]
            ];

            $datas = $this->dynamicCreate([
                'tableName' => $tableName,
                'inputData' => $createDatas,
            ]);

            $result = DB::insert($datas);
            return response()->json([
                'result' => $result,
                'sql' => $datas,
            ], 200);

        }
    }

    //update rra
    public function updateMainRra_new(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'current_id' => 'required',
            'form_no' => 'required',
            'rra_pra_date_start' => 'required',
            'rra_pra_date_end' => 'required',
            'village' => 'required',
            'lahan_menurut_masyarakat' => 'required',
            'tanah_sawah' => 'required',
            'tegal_ladang' => 'required',
            'pemukiman' => 'required',
            'pekarangan' => 'required',
            'tanah_rawa' => 'required',
            'waduk_danau' => 'required',
            'tanah_perkebunan_rakyat' => 'required',
            'tanah_perkebunan_negara' => 'required',
            'tanah_perkebunan_swasta' => 'required',
            'hutan_lindung' => 'required',
            'hutan_rakyat' => 'required',
            'fasilitas_umum' => 'required',
            'commodity_photo' => 'required',
            'institution_photo' => 'required',
            'organic_farming_photo' => 'required',
            'status_document' => 'required',
        ]);
        if ($validator->fails()) {
            $rslt = $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        } else {
            $current_id = $request->current_id;
            $tableName = 'rras';
            $updateDatas = [
                "0" => ['table_header' => 'form_no', 'table_new_data' => $request->form_no, 'type' => 'string'],
                "1" => ['table_header' => 'rra_pra_date_start', 'table_new_data' => $request->rra_pra_date_start, 'type' => 'string'],
                "2" => ['table_header' => 'rra_pra_date_end', 'table_new_data' => $request->rra_pra_date_end, 'type' => 'string'],
                "3" => ['table_header' => 'village', 'table_new_data' => $request->village, 'type' => 'string'],
                "4" => ['table_header' => 'lahan_menurut_masyarakat', 'table_new_data' => $request->lahan_menurut_masyarakat, 'type' => 'string'],
                "5" => ['table_header' => 'tanah_sawah', 'table_new_data' => $request->tanah_sawah, 'type' => 'int'],
                "6" => ['table_header' => 'tegal_ladang', 'table_new_data' => $request->tegal_ladang, 'type' => 'int'],
                "7" => ['table_header' => 'pemukiman', 'table_new_data' => $request->pemukiman, 'type' => 'int'],
                "8" => ['table_header' => 'pekarangan', 'table_new_data' => $request->pekarangan, 'type' => 'int'],
                "9" => ['table_header' => 'tanah_rawa', 'table_new_data' => $request->tanah_rawa, 'type' => 'int'],
                "10" => ['table_header' => 'waduk_danau', 'table_new_data' => $request->waduk_danau, 'type' => 'int'],
                "11" => ['table_header' => 'tanah_perkebunan_rakyat', 'table_new_data' => $request->tanah_perkebunan_rakyat, 'type' => 'int'],
                "12" => ['table_header' => 'tanah_perkebunan_negara', 'table_new_data' => $request->tanah_perkebunan_negara, 'type' => 'int'],
                "13" => ['table_header' => 'tanah_perkebunan_swasta', 'table_new_data' => $request->tanah_perkebunan_swasta, 'type' => 'int'],
                "14" => ['table_header' => 'hutan_lindung', 'table_new_data' => $request->hutan_lindung, 'type' => 'int'],
                "15" => ['table_header' => 'hutan_rakyat', 'table_new_data' => $request->hutan_rakyat, 'type' => 'int'],

                "16" => ['table_header' => 'fasilitas_umum', 'table_new_data' => $request->fasilitas_umum, 'type' => 'int'],
                "17" => ['table_header' => 'commodity_photo', 'table_new_data' => $request->commodity_photo, 'type' => 'string'],
                "18" => ['table_header' => 'institution_photo', 'table_new_data' => $request->institution_photo, 'type' => 'string'],
                "19" => ['table_header' => 'organic_farming_photo', 'table_new_data' => $request->organic_farming_photo, 'type' => 'string'],
                "20" => ['table_header' => 'status', 'table_new_data' => $request->status_document, 'type' => 'string'],

                "21" => ['table_header' => 'updated_at', 'table_new_data' => Carbon::now()]
            ];

            $datas = $this->DynamicUpdate([
                'current_id' => $current_id,
                'tableName' => $tableName,
                'inputData' => $updateDatas,
            ]);

            $result = DB::update($datas);
            return response()->json([
                'result' => $result,
                'sql' => $datas,
            ], 200);

        }
    }

    //add pra
    public function addMainPra_new(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'scooping_form_no' => 'required',
        ]);

        if ($validator->fails()) {
            $rslt = $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        } else {
            $pra_no = Pra::Maxno();
            $form_no = $request->scooping_form_no;
            $tableName = 'pras';

            $createDatas = [
                "0" => ['table_header' => 'pra_no', 'table_new_data' => $pra_no, 'type' => 'string'],
                "1" => ['table_header' => 'form_no', 'table_new_data' => $form_no, 'type' => 'string'],
                "2" => ['table_header' => 'land_ownership_description', 'table_new_data' => $request->land_ownership_description, 'type' => 'string'],
                "3" => ['table_header' => 'distribution_of_critical_land_locations_description', 'table_new_data' => $request->distribution_of_critical_land_locations_description, 'type' => 'string'],
                "4" => ['table_header' => 'collection_type', 'table_new_data' => $request->collection_type, 'type' => 'string'],
                "5" => ['table_header' => 'man_min_income', 'table_new_data' => $request->man_min_income, 'type' => 'int'],
                "6" => ['table_header' => 'man_max_income', 'table_new_data' => $request->man_max_income, 'type' => 'int'],
                "7" => ['table_header' => 'man_income_source', 'table_new_data' => $request->man_income_source, 'type' => 'string'],
                "8" => ['table_header' => 'man_commodity_name', 'table_new_data' => $request->man_commodity_name, 'type' => 'string'],
                "9" => ['table_header' => 'man_method', 'table_new_data' => $request->man_method, 'type' => 'string'],
                "10" => ['table_header' => 'man_average_capacity', 'table_new_data' => $request->man_average_capacity, 'type' => 'int'],
                "11" => ['table_header' => 'man_marketing', 'table_new_data' => $request->man_marketing, 'type' => 'string'],
                "12" => ['table_header' => 'man_period', 'table_new_data' => $request->man_period, 'type' => 'string'],
                "13" => ['table_header' => 'man_source', 'table_new_data' => $request->man_source, 'type' => 'string'],

                "14" => ['table_header' => 'woman_min_income', 'table_new_data' => $request->woman_min_income, 'type' => 'int'],
                "15" => ['table_header' => 'woman_max_income', 'table_new_data' => $request->woman_max_income, 'type' => 'int'],
                "16" => ['table_header' => 'woman_income_source', 'table_new_data' => $request->woman_income_source, 'type' => 'string'],
                "17" => ['table_header' => 'woman_commodity_name', 'table_new_data' => $request->woman_commodity_name, 'type' => 'string'],
                "18" => ['table_header' => 'woman_method', 'table_new_data' => $request->woman_method, 'type' => 'string'],
                "19" => ['table_header' => 'woman_average_capacity', 'table_new_data' => $request->woman_average_capacity, 'type' => 'int'],
                "20" => ['table_header' => 'woman_marketing', 'table_new_data' => $request->woman_marketing, 'type' => 'string'],
                "21" => ['table_header' => 'woman_period', 'table_new_data' => $request->woman_period, 'type' => 'string'],
                "22" => ['table_header' => 'woman_source', 'table_new_data' => $request->woman_source, 'type' => 'string'],
                "23" => ['table_header' => 'income_description', 'table_new_data' => $request->income_description, 'type' => 'string'],
                "24" => ['table_header' => 'land_utilization_source', 'table_new_data' => $request->land_utilization_source, 'type' => 'string'],
                "25" => ['table_header' => 'land_utilization_plant_type', 'table_new_data' => $request->land_utilization_plant_type, 'type' => 'string'],
                "26" => ['table_header' => 'land_utilization_description', 'table_new_data' => $request->land_utilization_description, 'type' => 'string'],
                "27" => ['table_header' => 'pra_watersource_description', 'table_new_data' => $request->pra_watersource_description, 'type' => 'string'],
                "28" => ['table_header' => 'dry_land_photo', 'table_new_data' => $request->dry_land_photo, 'type' => 'string'],
                "29" => ['table_header' => 'dry_land_photo2', 'table_new_data' => $request->dry_land_photo2, 'type' => 'string'],
                "30" => ['table_header' => 'watersource_photo', 'table_new_data' => $request->watersource_photo, 'type' => 'string'],
                "31" => ['table_header' => 'status', 'table_new_data' => $request->status_document, 'type' => 'string'],

                "32" => ['table_header' => 'complete_data', 'table_new_data' => 0, 'type' => 'string'],
                "33" => ['table_header' => 'is_dell', 'table_new_data' => 0, 'type' => 'string'],
                "34" => ['table_header' => 'user_id', 'table_new_data' => $request->user_id ?? Auth::user()->email ?? '-', 'type' => 'string'],
                "35" => ['table_header' => 'created_at', 'table_new_data' => Carbon::now()],
                "35" => ['table_header' => 'updated_at', 'table_new_data' => Carbon::now()]
            ];

            $datas = $this->dynamicCreate([
                'tableName' => $tableName,
                'inputData' => $createDatas,
            ]);

            $result = DB::insert($datas);
            return response()->json([
                'result' => $result,
                'sql' => $datas,
                'pra_no' => $pra_no,
            ], 200);

        }

    }
    public function addPraDisasterDetail_new(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'pra_no' => 'required',
        ]);

        if ($validator->fails()) {
            $rslt = $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        } else {
            $pra_no = $request->pra_no;
            $tableName = 'pra_disaster_details';
            $createDatas = [
                "0" => ['table_header' => 'pra_no', 'table_new_data' => $pra_no, 'type' => 'string'],
                "1" => ['table_header' => 'disaster_name', 'table_new_data' => $request->disaster_name, 'type' => 'string'],
                "2" => ['table_header' => 'disaster_categories', 'table_new_data' => $request->disaster_categories, 'type' => 'string'],
                "3" => ['table_header' => 'year', 'table_new_data' => $request->year, 'type' => 'string'],
                "4" => ['table_header' => 'fatalities', 'table_new_data' => $request->fatalities, 'type' => 'int'],
                "5" => ['table_header' => 'has_fatalities', 'table_new_data' => $request->has_fatalities, 'type' => 'int'],
                "6" => ['table_header' => 'detail', 'table_new_data' => $request->detail, 'type' => 'string'],
                "7" => ['table_header' => 'is_del', 'table_new_data' => 0, 'type' => 'int'],
                "8" => ['table_header' => 'created_at', 'table_new_data' => Carbon::now()],
                "9" => ['table_header' => 'updated_at', 'table_new_data' => Carbon::now()]
            ];

            $datas = $this->dynamicCreate([
                'tableName' => $tableName,
                'inputData' => $createDatas,
            ]);

            $result = DB::insert($datas);
            return response()->json([
                'result' => $result,
                'sql' => $datas,
            ], 200);

        }
    }
    public function addPraFretilizerDetail_new(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'pra_no' => 'required',
        ]);

        if ($validator->fails()) {
            $rslt = $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        } else {
            $pra_no = $request->pra_no;
            $tableName = 'pra_fertilizer_details';
            $createDatas = [
                "0" => ['table_header' => 'pra_no', 'table_new_data' => $pra_no, 'type' => 'string'],
                "1" => ['table_header' => 'fertilizer_categories', 'table_new_data' => $request->fertilizer_categories, 'type' => 'string'],
                "2" => ['table_header' => 'fertilizer_type', 'table_new_data' => $request->fertilizer_type, 'type' => 'string'],
                "3" => ['table_header' => 'fertilizer_name', 'table_new_data' => $request->fertilizer_name, 'type' => 'string'],
                "4" => ['table_header' => 'fertilizer_source', 'table_new_data' => $request->fertilizer_source, 'type' => 'string'],
                "5" => ['table_header' => 'fertilizer_description', 'table_new_data' => $request->fertilizer_description, 'type' => 'string'],
                "6" => ['table_header' => 'is_del', 'table_new_data' => 0, 'type' => 'int'],
                "7" => ['table_header' => 'created_at', 'table_new_data' => Carbon::now()],
                "8" => ['table_header' => 'updated_at', 'table_new_data' => Carbon::now()]
            ];

            $datas = $this->dynamicCreate([
                'tableName' => $tableName,
                'inputData' => $createDatas,
            ]);

            $result = DB::insert($datas);
            return response()->json([
                'result' => $result,
                'sql' => $datas,
            ], 200);

        }
    }
    public function addPraPesticideDetail_new(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'pra_no' => 'required',
        ]);

        if ($validator->fails()) {
            $rslt = $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        } else {
            $pra_no = $request->pra_no;
            $tableName = 'pra_pesticide_details';
            $createDatas = [
                "0" => ['table_header' => 'pra_no', 'table_new_data' => $pra_no, 'type' => 'string'],
                "1" => ['table_header' => 'pesticide_categories', 'table_new_data' => $request->pesticide_categories, 'type' => 'string'],
                "2" => ['table_header' => 'pesticide_type', 'table_new_data' => $request->pesticide_type, 'type' => 'string'],
                "3" => ['table_header' => 'pesticide_name', 'table_new_data' => $request->pesticide_name, 'type' => 'string'],
                "4" => ['table_header' => 'pesticide_source', 'table_new_data' => $request->pesticide_source, 'type' => 'string'],
                "5" => ['table_header' => 'pesticide_description', 'table_new_data' => $request->pesticide_description, 'type' => 'string'],
                "6" => ['table_header' => 'is_del', 'table_new_data' => 0, 'type' => 'int'],
                "7" => ['table_header' => 'created_at', 'table_new_data' => Carbon::now()],
                "8" => ['table_header' => 'updated_at', 'table_new_data' => Carbon::now()]
            ];

            $datas = $this->dynamicCreate([
                'tableName' => $tableName,
                'inputData' => $createDatas,
            ]);

            $result = DB::insert($datas);
            return response()->json([
                'result' => $result,
                'sql' => $datas,
            ], 200);

        }
    }
    public function addPraDryLandSpreads_new(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'pra_no' => 'required',
        ]);

        if ($validator->fails()) {
            $rslt = $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        } else {
            $pra_no = $request->pra_no;
            $tableName = 'pra_dry_land_spreads';
            $createDatas = [
                "0" => ['table_header' => 'pra_no', 'table_new_data' => $pra_no, 'type' => 'string'],
                "1" => ['table_header' => 'dusun_name', 'table_new_data' => $request->dusun_name, 'type' => 'string'],
                "2" => ['table_header' => 'type_utilization', 'table_new_data' => $request->type_utilization, 'type' => 'string'],
                "3" => ['table_header' => 'is_del', 'table_new_data' => 0, 'type' => 'int'],
                "4" => ['table_header' => 'created_at', 'table_new_data' => Carbon::now()],
                "5" => ['table_header' => 'updated_at', 'table_new_data' => Carbon::now()]
            ];

            $datas = $this->dynamicCreate([
                'tableName' => $tableName,
                'inputData' => $createDatas,
            ]);

            $result = DB::insert($datas);
            return response()->json([
                'result' => $result,
                'sql' => $datas,
            ], 200);

        }
    }
    public function addPraLandOwnership_new(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'pra_no' => 'required',
        ]);

        if ($validator->fails()) {
            $rslt = $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        } else {
            $pra_no = $request->pra_no;
            $tableName = 'pra_land_ownerships';
            $createDatas = [
                "0" => ['table_header' => 'pra_no', 'table_new_data' => $pra_no, 'type' => 'string'],
                "1" => ['table_header' => 'type_ownership', 'table_new_data' => $request->type_ownership, 'type' => 'string'],
                "2" => ['table_header' => 'land_ownership', 'table_new_data' => $request->land_ownership, 'type' => 'string'],
                "3" => ['table_header' => 'percentage', 'table_new_data' => $request->percentage, 'type' => 'int'],
                "4" => ['table_header' => 'is_del', 'table_new_data' => 0, 'type' => 'int'],
                "5" => ['table_header' => 'created_at', 'table_new_data' => Carbon::now()],
                "6" => ['table_header' => 'updated_at', 'table_new_data' => Carbon::now()]
            ];

            $datas = $this->dynamicCreate([
                'tableName' => $tableName,
                'inputData' => $createDatas,
            ]);

            $result = DB::insert($datas);
            return response()->json([
                'result' => $result,
                'sql' => $datas,
            ], 200);

        }
    }
    public function addPraWaterSource_new(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'pra_no' => 'required',
        ]);

        if ($validator->fails()) {
            $rslt = $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        } else {
            $pra_no = $request->pra_no;
            $tableName = 'pra_watersource_details';
            $createDatas = [
                "0" => ['table_header' => 'pra_no', 'table_new_data' => $pra_no, 'type' => 'string'],
                "1" => ['table_header' => 'watersource_name', 'table_new_data' => $request->watersource_name, 'type' => 'string'],
                "2" => ['table_header' => 'watersource_type', 'table_new_data' => $request->watersource_type, 'type' => 'string'],
                "3" => ['table_header' => 'consumption', 'table_new_data' => $request->consumption, 'type' => 'string'],
                "4" => ['table_header' => 'watersource_utilization', 'table_new_data' => $request->watersource_utilization, 'type' => 'string'],
                "5" => ['table_header' => 'watersource_condition', 'table_new_data' => $request->watersource_condition, 'type' => 'string'],
                "6" => ['table_header' => 'is_del', 'table_new_data' => 0, 'type' => 'int'],
                "7" => ['table_header' => 'created_at', 'table_new_data' => Carbon::now()],
                "8" => ['table_header' => 'updated_at', 'table_new_data' => Carbon::now()]
            ];

            $datas = $this->dynamicCreate([
                'tableName' => $tableName,
                'inputData' => $createDatas,
            ]);

            $result = DB::insert($datas);
            return response()->json([
                'result' => $result,
                'sql' => $datas,
            ], 200);

        }
    }
    public function addPraExistingProblem_new(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'pra_no' => 'required',
        ]);

        if ($validator->fails()) {
            $rslt = $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        } else {
            $pra_no = $request->pra_no;
            $tableName = 'pra_existing_problems';
            $createDatas = [
                "0" => ['table_header' => 'pra_no', 'table_new_data' => $pra_no, 'type' => 'string'],
                "1" => ['table_header' => 'date', 'table_new_data' => $request->date, 'type' => 'string'],
                "2" => ['table_header' => 'problem_name', 'table_new_data' => $request->problem_name, 'type' => 'string'],
                "3" => ['table_header' => 'problem_categories', 'table_new_data' => $request->problem_categories, 'type' => 'string'],
                "4" => ['table_header' => 'problem_source', 'table_new_data' => $request->problem_source, 'type' => 'string'],
                "5" => ['table_header' => 'problem_solution', 'table_new_data' => $request->problem_solution, 'type' => 'string'],
                "6" => ['table_header' => 'impact_to_people', 'table_new_data' => $request->impact_to_people, 'type' => 'int'],
                "7" => ['table_header' => 'interval_problem', 'table_new_data' => $request->interval_problem, 'type' => 'int'],
                "8" => ['table_header' => 'priority', 'table_new_data' => $request->priority, 'type' => 'int'],
                "9" => ['table_header' => 'potential', 'table_new_data' => $request->potential, 'type' => 'int'],
                "10" => ['table_header' => 'total_value', 'table_new_data' => $request->total_value, 'type' => 'int'],
                "11" => ['table_header' => 'ranking', 'table_new_data' => $request->ranking, 'type' => 'int'],
                "12" => ['table_header' => 'is_del', 'table_new_data' => 0, 'type' => 'int'],
                "13" => ['table_header' => 'created_at', 'table_new_data' => Carbon::now()],
                "14" => ['table_header' => 'updated_at', 'table_new_data' => Carbon::now()]
            ];

            $datas = $this->dynamicCreate([
                'tableName' => $tableName,
                'inputData' => $createDatas,
            ]);

            $result = DB::insert($datas);
            return response()->json([
                'result' => $result,
                'sql' => $datas,
            ], 200);

        }
    }
    public function addPraFarmerIncome_new(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'pra_no' => 'required',
        ]);

        if ($validator->fails()) {
            $rslt = $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        } else {
            $pra_no = $request->pra_no;
            $tableName = 'pra_farmer_incomes';
            $createDatas = [
                "0" => ['table_header' => 'pra_no', 'table_new_data' => $pra_no, 'type' => 'string'],
                "1" => ['table_header' => 'name', 'table_new_data' => $request->name, 'type' => 'string'],
                "2" => ['table_header' => 'gender', 'table_new_data' => $request->gender, 'type' => 'string'],
                "3" => ['table_header' => 'source', 'table_new_data' => $request->source, 'type' => 'string'],
                "4" => ['table_header' => 'source_income', 'table_new_data' => $request->source_income, 'type' => 'string'],
                "5" => ['table_header' => 'capacity', 'table_new_data' => $request->capacity, 'type' => 'int'],
                "6" => ['table_header' => 'commodity_name', 'table_new_data' => $request->commodity_name, 'type' => 'string'],
                "7" => ['table_header' => 'family_member', 'table_new_data' => $request->family_member, 'type' => 'int'],
                "8" => ['table_header' => 'family_type', 'table_new_data' => $request->family_type, 'type' => 'string'],
                "9" => ['table_header' => 'indirect_method', 'table_new_data' => $request->indirect_method, 'type' => 'string'],
                "10" => ['table_header' => 'job', 'table_new_data' => $request->job, 'type' => 'string'],
                "11" => ['table_header' => 'method', 'table_new_data' => $request->method, 'type' => 'string'],
                "12" => ['table_header' => 'period', 'table_new_data' => $request->period, 'type' => 'string'],
                "13" => ['table_header' => 'is_del', 'table_new_data' => 0, 'type' => 'int'],
                "14" => ['table_header' => 'created_at', 'table_new_data' => Carbon::now()],
                "15" => ['table_header' => 'updated_at', 'table_new_data' => Carbon::now()]
            ];

            $datas = $this->dynamicCreate([
                'tableName' => $tableName,
                'inputData' => $createDatas,
            ]);

            $result = DB::insert($datas);
            return response()->json([
                'result' => $result,
                'sql' => $datas,
            ], 200);

        }
    }
    public function addSocialImpactFaunaDetails_new(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'pra_no' => 'required',
        ]);

        if ($validator->fails()) {
            $rslt = $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        } else {
            $pra_no = $request->pra_no;
            $tableName = 'socialimpact_fauna_details';
            $createDatas = [
                "0" => ['table_header' => 'pra_no', 'table_new_data' => $pra_no, 'type' => 'string'],
                "1" => ['table_header' => 'fauna_categories', 'table_new_data' => $request->fauna_categories, 'type' => 'string'],
                "2" => ['table_header' => 'fauna_name', 'table_new_data' => $request->fauna_name, 'type' => 'string'],
                "3" => ['table_header' => 'fauna_population', 'table_new_data' => $request->fauna_population, 'type' => 'string'],
                "4" => ['table_header' => 'fauna_foodsource', 'table_new_data' => $request->fauna_foodsource, 'type' => 'string'],
                "5" => ['table_header' => 'fauna_status', 'table_new_data' => $request->fauna_status, 'type' => 'string'],
                "6" => ['table_header' => 'fauna_habitat', 'table_new_data' => $request->fauna_habitat, 'type' => 'string'],
                "12" => ['table_header' => 'is_del', 'table_new_data' => 0, 'type' => 'int'],
                "13" => ['table_header' => 'created_at', 'table_new_data' => Carbon::now()],
                "14" => ['table_header' => 'updated_at', 'table_new_data' => Carbon::now()]
            ];

            $datas = $this->dynamicCreate([
                'tableName' => $tableName,
                'inputData' => $createDatas,
            ]);

            $result = DB::insert($datas);
            return response()->json([
                'result' => $result,
                'sql' => $datas,
            ], 200);

        }
    }
    public function addSocialImpactFloraDetails_new(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'pra_no' => 'required',
        ]);

        if ($validator->fails()) {
            $rslt = $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        } else {
            $pra_no = $request->pra_no;
            $tableName = 'socialimpact_flora_details';
            $createDatas = [
                "0" => ['table_header' => 'pra_no', 'table_new_data' => $pra_no, 'type' => 'string'],
                "1" => ['table_header' => 'flora_categories', 'table_new_data' => $request->flora_categories, 'type' => 'string'],
                "2" => ['table_header' => 'flora_name', 'table_new_data' => $request->flora_name, 'type' => 'string'],
                "3" => ['table_header' => 'flora_population', 'table_new_data' => $request->flora_population, 'type' => 'string'],
                "4" => ['table_header' => 'flora_foodsource', 'table_new_data' => $request->flora_foodsource, 'type' => 'string'],
                "5" => ['table_header' => 'flora_status', 'table_new_data' => $request->flora_status, 'type' => 'string'],
                "6" => ['table_header' => 'flora_habitat', 'table_new_data' => $request->flora_habitat, 'type' => 'string'],
                "12" => ['table_header' => 'is_del', 'table_new_data' => 0, 'type' => 'int'],
                "13" => ['table_header' => 'created_at', 'table_new_data' => Carbon::now()],
                "14" => ['table_header' => 'updated_at', 'table_new_data' => Carbon::now()]
            ];

            $datas = $this->dynamicCreate([
                'tableName' => $tableName,
                'inputData' => $createDatas,
            ]);

            $result = DB::insert($datas);
            return response()->json([
                'result' => $result,
                'sql' => $datas,
            ], 200);

        }
    }

    //Delete rra-pra
    public function deleteRraPra_new(Request $request)
    {
        $validator = Validator::make($request->all(), [
            // 'rra_no' => 'required',
            // 'pra_no' => 'required',
            'delete_type' => 'required' //soft_delete /hard_delete
        ]);
        if ($validator->fails()) {
            $rslt = $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        } else {
            if ($request->delete_type == 'soft_delete') {
                $softDeleteMain = [
                    "0" => ['table_header' => 'is_dell', 'table_new_data' => '1', 'type' => 'string'],
                ];
                $softDeleteUtils = [
                    "0" => ['table_header' => 'is_del', 'table_new_data' => '1', 'type' => 'string'],
                ];
                if (isset($request->rra_no)) {
                    $mainRraQuery = $this->DynamicUpdate([
                        'current_id' => $request->rra_no,
                        'tableName' => 'rras',
                        'inputData' => $softDeleteMain,
                        'other_id_index' => 'rra_no',
                        'id_data_type' => 'string'
                    ]);
                    $RraVillageBorderQuery = $this->DynamicUpdate([
                        'current_id' => $request->rra_no,
                        'tableName' => 'village_borders',
                        'inputData' => $softDeleteUtils,
                        'other_id_index' => 'rra_no',
                        'id_data_type' => 'string'
                    ]);
                    $RraLandUseQuery = $this->DynamicUpdate([
                        'current_id' => $request->rra_no,
                        'tableName' => 'rra_land_uses',
                        'inputData' => $softDeleteUtils,
                        'other_id_index' => 'rra_no',
                        'id_data_type' => 'string'
                    ]);
                    $RraExistingPlantQuery = $this->DynamicUpdate([
                        'current_id' => $request->rra_no,
                        'tableName' => 'rra_existing_plants',
                        'inputData' => $softDeleteUtils,
                        'other_id_index' => 'rra_no',
                        'id_data_type' => 'string'
                    ]);
                    $RraCommunityInstitutionQuery = $this->DynamicUpdate([
                        'current_id' => $request->rra_no,
                        'tableName' => 'rra_community_institutions',
                        'inputData' => $softDeleteUtils,
                        'other_id_index' => 'rra_no',
                        'id_data_type' => 'string'
                    ]);
                    $RraOrganicPotentialsQuery = $this->DynamicUpdate([
                        'current_id' => $request->rra_no,
                        'tableName' => 'rra_organic_potentials',
                        'inputData' => $softDeleteUtils,
                        'other_id_index' => 'rra_no',
                        'id_data_type' => 'string'
                    ]);
                    $RraProductionMarketingQuery = $this->DynamicUpdate([
                        'current_id' => $request->rra_no,
                        'tableName' => 'rra_production_marketings',
                        'inputData' => $softDeleteUtils,
                        'other_id_index' => 'rra_no',
                        'id_data_type' => 'string'
                    ]);
                    $RraInnovativeFarmerQuery = $this->DynamicUpdate([
                        'current_id' => $request->rra_no,
                        'tableName' => 'rra_innovative_farmers',
                        'inputData' => $softDeleteUtils,
                        'other_id_index' => 'rra_no',
                        'id_data_type' => 'string'
                    ]);
                    $RraDusunQuery = $this->DynamicUpdate([
                        'current_id' => $request->rra_no,
                        'tableName' => 'rra_dusuns',
                        'inputData' => $softDeleteUtils,
                        'other_id_index' => 'rra_no',
                        'id_data_type' => 'string'
                    ]);
                    //DB function
                    $mainRraResult = DB::update($mainRraQuery);
                    $RraVillageBorderResult = DB::update($RraVillageBorderQuery);
                    $RraLandUseResult = DB::update($RraLandUseQuery);
                    $RraExistingPlantResult = DB::update($RraExistingPlantQuery);
                    $RraComunityIntitutionResult = DB::update($RraCommunityInstitutionQuery);
                    $RraOrganicPotentialResult = DB::update($RraOrganicPotentialsQuery);
                    $RraProductionMarketingResult = DB::update($RraProductionMarketingQuery);
                    $RraInnovativeFarmerResult = DB::update($RraInnovativeFarmerQuery);
                    $RraDusunResult = DB::update($RraDusunQuery);

                    return response()->json([
                        'result_main_rra' => $mainRraResult,
                        'result_rra_village_border' => $RraVillageBorderResult,
                        'result_rra_land_use' => $RraLandUseResult,
                        'result_rra_existing_plant' => $RraExistingPlantResult,
                        'result_rra_community_institution' => $RraComunityIntitutionResult,
                        'result_rra_organic_potentials' => $RraOrganicPotentialResult,
                        'result_rra_production_marketing' => $RraProductionMarketingResult,
                        'result_rra_innovative_farmer' => $RraInnovativeFarmerResult,
                        'result_rra_dusun' => $RraDusunResult,
                    ], 200);
                } else if (isset($request->pra_no)) {
                    // return response() -> json('Soft Deletenya Sabar Dulu Ya Kakak! :D', 200);
                    $mainPraQuery = $this->DynamicUpdate([
                        'current_id' => $request->pra_no,
                        'tableName' => 'pras',
                        'inputData' => $softDeleteMain,
                        'other_id_index' => 'pra_no',
                        'id_data_type' => 'string'
                    ]);
                    $PraDisasterDetailQuery = $this->DynamicUpdate([
                        'current_id' => $request->pra_no,
                        'tableName' => 'pra_disaster_details',
                        'inputData' => $softDeleteMain,
                        'other_id_index' => 'pra_no',
                        'id_data_type' => 'string'
                    ]);
                    $PraFertilizerDetailQuery = $this->DynamicUpdate([
                        'current_id' => $request->pra_no,
                        'tableName' => 'pra_fertilizer_details',
                        'inputData' => $softDeleteMain,
                        'other_id_index' => 'pra_no',
                        'id_data_type' => 'string'
                    ]);
                    $PraPesticideDetailQuery = $this->DynamicUpdate([
                        'current_id' => $request->pra_no,
                        'tableName' => 'pra_pesticide_details',
                        'inputData' => $softDeleteMain,
                        'other_id_index' => 'pra_no',
                        'id_data_type' => 'string'
                    ]);
                    $PraDryLandSpreadQuery = $this->DynamicUpdate([
                        'current_id' => $request->pra_no,
                        'tableName' => 'pra_dry_land_spreads',
                        'inputData' => $softDeleteMain,
                        'other_id_index' => 'pra_no',
                        'id_data_type' => 'string'
                    ]);
                    $PraLandOwnershipQuery = $this->DynamicUpdate([
                        'current_id' => $request->pra_no,
                        'tableName' => 'pra_land_ownerships',
                        'inputData' => $softDeleteMain,
                        'other_id_index' => 'pra_no',
                        'id_data_type' => 'string'
                    ]);
                    $PraWaterSourceQuery = $this->DynamicUpdate([
                        'current_id' => $request->pra_no,
                        'tableName' => 'pra_watersource_details',
                        'inputData' => $softDeleteMain,
                        'other_id_index' => 'pra_no',
                        'id_data_type' => 'string'
                    ]);
                    $PraExistingProblemQuery = $this->DynamicUpdate([
                        'current_id' => $request->pra_no,
                        'tableName' => 'pra_existing_problems',
                        'inputData' => $softDeleteMain,
                        'other_id_index' => 'pra_no',
                        'id_data_type' => 'string'
                    ]);
                    $PraFarmerIncomeQuery = $this->DynamicUpdate([
                        'current_id' => $request->pra_no,
                        'tableName' => 'pra_farmer_incomes',
                        'inputData' => $softDeleteMain,
                        'other_id_index' => 'pra_no',
                        'id_data_type' => 'string'
                    ]);
                    $SocialImpactFaunaQuery = $this->DynamicUpdate([
                        'current_id' => $request->pra_no,
                        'tableName' => 'socialimpact_fauna_details',
                        'inputData' => $softDeleteMain,
                        'other_id_index' => 'pra_no',
                        'id_data_type' => 'string'
                    ]);
                    $SocialImpactFloraQuery = $this->DynamicUpdate([
                        'current_id' => $request->pra_no,
                        'tableName' => 'socialimpact_flora_details',
                        'inputData' => $softDeleteMain,
                        'other_id_index' => 'pra_no',
                        'id_data_type' => 'string'
                    ]);

                    //DB function
                    $mainPraResult = DB::update($mainPraQuery);
                    $PraDisasterDetailResult = DB::update($PraDisasterDetailQuery);
                    $PraFertilizerdetailResult = DB::update($PraFertilizerDetailQuery);
                    $PraPesticideDetailResult = DB::update($PraPesticideDetailQuery);
                    $PraDryLandSpreadsResult = DB::update($PraDryLandSpreadQuery);
                    $PraLandOwnershipResult = DB::update($PraLandOwnershipQuery);
                    $PraWaterSourceResult = DB::update($PraWaterSourceQuery);
                    $PraExistingProblemResult = DB::update($PraExistingProblemQuery);
                    $PraFarmerIncomeResult = DB::update($PraFarmerIncomeQuery);
                    $SocialImpactFaunaResult = DB::update($SocialImpactFaunaQuery);
                    $SocialImpactFloraResult = DB::update($SocialImpactFloraQuery);
                    return response()->json([
                        'result_main_pra' => $mainPraResult,
                        'result_pra_disaster_detail' => $PraDisasterDetailResult,
                        'result_pra_fertilizer_detail' => $PraFertilizerdetailResult,
                        'result_pra_pesticide_detail' => $PraPesticideDetailResult,
                        'result_pra_dry_land_spread' => $PraDryLandSpreadsResult,
                        'result_pra_land_ownership' => $PraLandOwnershipResult,
                        'result_pra_water_source' => $PraWaterSourceResult,
                        'result_pra_existing_problem' => $PraExistingProblemResult,
                        'result_pra_farmer_income' => $PraFarmerIncomeResult,
                        'result_social_impact_fauna' => $SocialImpactFaunaResult,
                        'result_social_impact_flora' => $SocialImpactFloraResult,
                    ], 200);
                } else if (isset($request->rra_no) and isset($request->pra_no)) {
                    // RRA
                    $mainRraQuery = $this->DynamicUpdate([
                        'current_id' => $request->rra_no,
                        'tableName' => 'rras',
                        'inputData' => $softDeleteMain,
                        'other_id_index' => 'rra_no',
                        'id_data_type' => 'string'
                    ]);
                    $RraVillageBorderQuery = $this->DynamicUpdate([
                        'current_id' => $request->rra_no,
                        'tableName' => 'village_borders',
                        'inputData' => $softDeleteUtils,
                        'other_id_index' => 'rra_no',
                        'id_data_type' => 'string'
                    ]);
                    $RraLandUseQuery = $this->DynamicUpdate([
                        'current_id' => $request->rra_no,
                        'tableName' => 'rra_land_uses',
                        'inputData' => $softDeleteUtils,
                        'other_id_index' => 'rra_no',
                        'id_data_type' => 'string'
                    ]);
                    $RraExistingPlantQuery = $this->DynamicUpdate([
                        'current_id' => $request->rra_no,
                        'tableName' => 'rra_existing_plants',
                        'inputData' => $softDeleteUtils,
                        'other_id_index' => 'rra_no',
                        'id_data_type' => 'string'
                    ]);
                    $RraCommunityInstitutionQuery = $this->DynamicUpdate([
                        'current_id' => $request->rra_no,
                        'tableName' => 'rra_community_institutions',
                        'inputData' => $softDeleteUtils,
                        'other_id_index' => 'rra_no',
                        'id_data_type' => 'string'
                    ]);
                    $RraOrganicPotentialsQuery = $this->DynamicUpdate([
                        'current_id' => $request->rra_no,
                        'tableName' => 'rra_organic_potentials',
                        'inputData' => $softDeleteUtils,
                        'other_id_index' => 'rra_no',
                        'id_data_type' => 'string'
                    ]);
                    $RraProductionMarketingQuery = $this->DynamicUpdate([
                        'current_id' => $request->rra_no,
                        'tableName' => 'rra_production_marketings',
                        'inputData' => $softDeleteUtils,
                        'other_id_index' => 'rra_no',
                        'id_data_type' => 'string'
                    ]);
                    $RraInnovativeFarmerQuery = $this->DynamicUpdate([
                        'current_id' => $request->rra_no,
                        'tableName' => 'rra_innovative_farmers',
                        'inputData' => $softDeleteUtils,
                        'other_id_index' => 'rra_no',
                        'id_data_type' => 'string'
                    ]);
                    $RraDusunQuery = $this->DynamicUpdate([
                        'current_id' => $request->rra_no,
                        'tableName' => 'rra_dusuns',
                        'inputData' => $softDeleteUtils,
                        'other_id_index' => 'rra_no',
                        'id_data_type' => 'string'
                    ]);
                    //DB function
                    $mainRraResult = DB::update($mainRraQuery);
                    $RraVillageBorderResult = DB::update($RraVillageBorderQuery);
                    $RraLandUseResult = DB::update($RraLandUseQuery);
                    $RraExistingPlantResult = DB::update($RraExistingPlantQuery);
                    $RraComunityIntitutionResult = DB::update($RraCommunityInstitutionQuery);
                    $RraOrganicPotentialResult = DB::update($RraOrganicPotentialsQuery);
                    $RraProductionMarketingResult = DB::update($RraProductionMarketingQuery);
                    $RraInnovativeFarmerResult = DB::update($RraInnovativeFarmerQuery);
                    $RraDusunResult = DB::update($RraDusunQuery);

                    // PRA
                    $mainPraQuery = $this->DynamicUpdate([
                        'current_id' => $request->pra_no,
                        'tableName' => 'pras',
                        'inputData' => $softDeleteMain,
                        'other_id_index' => 'pra_no',
                        'id_data_type' => 'string'
                    ]);
                    $PraDisasterDetailQuery = $this->DynamicUpdate([
                        'current_id' => $request->pra_no,
                        'tableName' => 'pra_disaster_details',
                        'inputData' => $softDeleteMain,
                        'other_id_index' => 'pra_no',
                        'id_data_type' => 'string'
                    ]);
                    $PraFertilizerDetailQuery = $this->DynamicUpdate([
                        'current_id' => $request->pra_no,
                        'tableName' => 'pra_fertilizer_details',
                        'inputData' => $softDeleteMain,
                        'other_id_index' => 'pra_no',
                        'id_data_type' => 'string'
                    ]);
                    $PraPesticideDetailQuery = $this->DynamicUpdate([
                        'current_id' => $request->pra_no,
                        'tableName' => 'pra_pesticide_details',
                        'inputData' => $softDeleteMain,
                        'other_id_index' => 'pra_no',
                        'id_data_type' => 'string'
                    ]);
                    $PraDryLandSpreadQuery = $this->DynamicUpdate([
                        'current_id' => $request->pra_no,
                        'tableName' => 'pra_dry_land_spreads',
                        'inputData' => $softDeleteMain,
                        'other_id_index' => 'pra_no',
                        'id_data_type' => 'string'
                    ]);
                    $PraLandOwnershipQuery = $this->DynamicUpdate([
                        'current_id' => $request->pra_no,
                        'tableName' => 'pra_land_ownerships',
                        'inputData' => $softDeleteMain,
                        'other_id_index' => 'pra_no',
                        'id_data_type' => 'string'
                    ]);
                    $PraWaterSourceQuery = $this->DynamicUpdate([
                        'current_id' => $request->pra_no,
                        'tableName' => 'pra_watersource_details',
                        'inputData' => $softDeleteMain,
                        'other_id_index' => 'pra_no',
                        'id_data_type' => 'string'
                    ]);
                    $PraExistingProblemQuery = $this->DynamicUpdate([
                        'current_id' => $request->pra_no,
                        'tableName' => 'pra_existing_problems',
                        'inputData' => $softDeleteMain,
                        'other_id_index' => 'pra_no',
                        'id_data_type' => 'string'
                    ]);
                    $PraFarmerIncomeQuery = $this->DynamicUpdate([
                        'current_id' => $request->pra_no,
                        'tableName' => 'pra_farmer_incomes',
                        'inputData' => $softDeleteMain,
                        'other_id_index' => 'pra_no',
                        'id_data_type' => 'string'
                    ]);
                    $SocialImpactFaunaQuery = $this->DynamicUpdate([
                        'current_id' => $request->pra_no,
                        'tableName' => 'socialimpact_fauna_details',
                        'inputData' => $softDeleteMain,
                        'other_id_index' => 'pra_no',
                        'id_data_type' => 'string'
                    ]);
                    $SocialImpactFloraQuery = $this->DynamicUpdate([
                        'current_id' => $request->pra_no,
                        'tableName' => 'socialimpact_flora_details',
                        'inputData' => $softDeleteMain,
                        'other_id_index' => 'pra_no',
                        'id_data_type' => 'string'
                    ]);

                    //DB function
                    $mainPraResult = DB::update($mainPraQuery);
                    $PraDisasterDetailResult = DB::update($PraDisasterDetailQuery);
                    $PraFertilizerdetailResult = DB::update($PraFertilizerDetailQuery);
                    $PraPesticideDetailResult = DB::update($PraPesticideDetailQuery);
                    $PraDryLandSpreadsResult = DB::update($PraDryLandSpreadQuery);
                    $PraLandOwnershipResult = DB::update($PraLandOwnershipQuery);
                    $PraWaterSourceResult = DB::update($PraWaterSourceQuery);
                    $PraExistingProblemResult = DB::update($PraExistingProblemQuery);
                    $PraFarmerIncomeResult = DB::update($PraFarmerIncomeQuery);
                    $SocialImpactFaunaResult = DB::update($SocialImpactFaunaQuery);
                    $SocialImpactFloraResult = DB::update($SocialImpactFloraQuery);

                    return response()->json([
                        'result_main_rra' => $mainRraResult,
                        'result_rra_village_border' => $RraVillageBorderResult,
                        'result_rra_land_use' => $RraLandUseResult,
                        'result_rra_existing_plant' => $RraExistingPlantResult,
                        'result_rra_community_institution' => $RraComunityIntitutionResult,
                        'result_rra_organic_potentials' => $RraOrganicPotentialResult,
                        'result_rra_production_marketing' => $RraProductionMarketingResult,
                        'result_rra_innovative_farmer' => $RraInnovativeFarmerResult,
                        'result_rra_dusun' => $RraDusunResult,
                    ], 200);
                }

            } else if ($request->delete_type == 'hard_delete') {
                if (isset($request->rra_no)) {
                    $mainRraQuery = $this->DynamicDelete([
                        'current_id' => $request->rra_no,
                        'tableName' => 'rras',
                        'other_id_index' => 'rra_no',
                        'index_data_type' => 'string'
                    ]);
                    $RraVillageBorderQuery = $this->DynamicDelete([
                        'current_id' => $request->rra_no,
                        'tableName' => 'village_borders',
                        'other_id_index' => 'rra_no',
                        'index_data_type' => 'string'
                    ]);
                    $RraLandUseQuery = $this->DynamicDelete([
                        'current_id' => $request->rra_no,
                        'tableName' => 'rra_land_uses',
                        'other_id_index' => 'rra_no',
                        'index_data_type' => 'string'
                    ]);
                    $RraExistingPlantQuery = $this->DynamicDelete([
                        'current_id' => $request->rra_no,
                        'tableName' => 'rra_existing_plants',
                        'other_id_index' => 'rra_no',
                        'index_data_type' => 'string'
                    ]);
                    $RraCommunityInstitutionQuery = $this->DynamicDelete([
                        'current_id' => $request->rra_no,
                        'tableName' => 'rra_community_institutions',
                        'other_id_index' => 'rra_no',
                        'index_data_type' => 'string'
                    ]);
                    $RraOrganicPotentialsQuery = $this->DynamicDelete([
                        'current_id' => $request->rra_no,
                        'tableName' => 'rra_organic_potentials',
                        'other_id_index' => 'rra_no',
                        'index_data_type' => 'string'
                    ]);
                    $RraProductionMarketingQuery = $this->DynamicDelete([
                        'current_id' => $request->rra_no,
                        'tableName' => 'rra_production_marketings',
                        'other_id_index' => 'rra_no',
                        'index_data_type' => 'string'
                    ]);
                    $RraInnovativeFarmerQuery = $this->DynamicDelete([
                        'current_id' => $request->rra_no,
                        'tableName' => 'rra_innovative_farmers',
                        'other_id_index' => 'rra_no',
                        'index_data_type' => 'string'
                    ]);
                    $RraDusunQuery = $this->DynamicDelete([
                        'current_id' => $request->rra_no,
                        'tableName' => 'rra_dusuns',
                        'other_id_index' => 'rra_no',
                        'index_data_type' => 'string'
                    ]);
                    //DB function
                    $mainRraResult = DB::delete($mainRraQuery);
                    $RraVillageBorderResult = DB::delete($RraVillageBorderQuery);
                    $RraLandUseResult = DB::delete($RraLandUseQuery);
                    $RraExistingPlantResult = DB::delete($RraExistingPlantQuery);
                    $RraComunityIntitutionResult = DB::delete($RraCommunityInstitutionQuery);
                    $RraOrganicPotentialResult = DB::delete($RraOrganicPotentialsQuery);
                    $RraProductionMarketingResult = DB::delete($RraProductionMarketingQuery);
                    $RraInnovativeFarmerResult = DB::delete($RraInnovativeFarmerQuery);
                    $RraDusunResult = DB::delete($RraDusunQuery);
                    return response()->json([
                        'result_main_rra' => $mainRraResult,
                        'result_rra_village_border' => $RraVillageBorderResult,
                        'result_rra_land_use' => $RraLandUseResult,
                        'result_rra_existing_plant' => $RraExistingPlantResult,
                        'result_rra_community_institution' => $RraComunityIntitutionResult,
                        'result_rra_organic_potentials' => $RraOrganicPotentialResult,
                        'result_rra_production_marketing' => $RraProductionMarketingResult,
                        'result_rra_innovative_farmer' => $RraInnovativeFarmerResult,
                        'result_rra_dusun' => $RraDusunResult,
                    ], 200);
                } else if (isset($request->pra_no)) {
                    $mainPraQuery = $this->DynamicDelete([
                        'current_id' => $request->pra_no,
                        'tableName' => 'pras',
                        'other_id_index' => 'pra_no',
                        'index_data_type' => 'string'
                    ]);
                    $PraDisasterDetailQuery = $this->DynamicDelete([
                        'current_id' => $request->pra_no,
                        'tableName' => 'pra_disaster_details',
                        'other_id_index' => 'pra_no',
                        'index_data_type' => 'string'
                    ]);
                    $PraFertilizerDetailQuery = $this->DynamicDelete([
                        'current_id' => $request->pra_no,
                        'tableName' => 'pra_fertilizer_details',
                        'other_id_index' => 'pra_no',
                        'index_data_type' => 'string'
                    ]);
                    $PraPesticideDetailQuery = $this->DynamicDelete([
                        'current_id' => $request->pra_no,
                        'tableName' => 'pra_pesticide_details',
                        'other_id_index' => 'pra_no',
                        'index_data_type' => 'string'
                    ]);
                    $PraDryLandSpreadQuery = $this->DynamicDelete([
                        'current_id' => $request->pra_no,
                        'tableName' => 'pra_dry_land_spreads',
                        'other_id_index' => 'pra_no',
                        'index_data_type' => 'string'
                    ]);
                    $PraLandOwnershipQuery = $this->DynamicDelete([
                        'current_id' => $request->pra_no,
                        'tableName' => 'pra_land_ownerships',
                        'other_id_index' => 'pra_no',
                        'index_data_type' => 'string'
                    ]);
                    $PraWaterSourceQuery = $this->DynamicDelete([
                        'current_id' => $request->pra_no,
                        'tableName' => 'pra_watersource_details',
                        'other_id_index' => 'pra_no',
                        'index_data_type' => 'string'
                    ]);
                    $PraExistingProblemQuery = $this->DynamicDelete([
                        'current_id' => $request->pra_no,
                        'tableName' => 'pra_existing_problems',
                        'other_id_index' => 'pra_no',
                        'index_data_type' => 'string'
                    ]);
                    $PraFarmerIncomeQuery = $this->DynamicDelete([
                        'current_id' => $request->pra_no,
                        'tableName' => 'pra_farmer_incomes',
                        'other_id_index' => 'pra_no',
                        'index_data_type' => 'string'
                    ]);
                    $SocialImpactFaunaQuery = $this->DynamicDelete([
                        'current_id' => $request->pra_no,
                        'tableName' => 'socialimpact_fauna_details',
                        'other_id_index' => 'pra_no',
                        'index_data_type' => 'string'
                    ]);
                    $SocialImpactFloraQuery = $this->DynamicDelete([
                        'current_id' => $request->pra_no,
                        'tableName' => 'socialimpact_flora_details',
                        'other_id_index' => 'pra_no',
                        'index_data_type' => 'string'
                    ]);
                    //DB function
                    $mainPraResult = DB::delete($mainPraQuery);
                    $PraDisasterDetailResult = DB::delete($PraDisasterDetailQuery);
                    $PraFertilizerdetailResult = DB::delete($PraFertilizerDetailQuery);
                    $PraPesticideDetailResult = DB::delete($PraPesticideDetailQuery);
                    $PraDryLandSpreadsResult = DB::delete($PraDryLandSpreadQuery);
                    $PraLandOwnershipResult = DB::delete($PraLandOwnershipQuery);
                    $PraWaterSourceResult = DB::delete($PraWaterSourceQuery);
                    $PraExistingProblemResult = DB::delete($PraExistingProblemQuery);
                    $PraFarmerIncomeResult = DB::delete($PraFarmerIncomeQuery);
                    $SocialImpactFaunaResult = DB::delete($SocialImpactFaunaQuery);
                    $SocialImpactFloraResult = DB::delete($SocialImpactFloraQuery);
                    return response()->json([
                        'result_main_pra' => $mainPraResult,
                        'result_pra_disaster_detail' => $PraDisasterDetailResult,
                        'result_pra_fertilizer_detail' => $PraFertilizerdetailResult,
                        'result_pra_pesticide_detail' => $PraPesticideDetailResult,
                        'result_pra_dry_land_spread' => $PraDryLandSpreadsResult,
                        'result_pra_land_ownership' => $PraLandOwnershipResult,
                        'result_pra_water_source' => $PraWaterSourceResult,
                        'result_pra_existing_problem' => $PraExistingProblemResult,
                        'result_pra_farmer_income' => $PraFarmerIncomeResult,
                        'result_social_impact_fauna' => $SocialImpactFaunaResult,
                        'result_social_impact_flora' => $SocialImpactFloraResult,
                    ], 200);
                } else if (isset($request->rra_no) and isset($request->pra_no)) {
                    // RRA
                    $mainRraQuery = $this->DynamicDelete([
                        'current_id' => $request->rra_no,
                        'tableName' => 'rras',
                        'other_id_index' => 'rra_no',
                        'index_data_type' => 'string'
                    ]);
                    $RraVillageBorderQuery = $this->DynamicDelete([
                        'current_id' => $request->rra_no,
                        'tableName' => 'village_borders',
                        'other_id_index' => 'rra_no',
                        'index_data_type' => 'string'
                    ]);
                    $RraLandUseQuery = $this->DynamicDelete([
                        'current_id' => $request->rra_no,
                        'tableName' => 'rra_land_uses',
                        'other_id_index' => 'rra_no',
                        'index_data_type' => 'string'
                    ]);
                    $RraExistingPlantQuery = $this->DynamicDelete([
                        'current_id' => $request->rra_no,
                        'tableName' => 'rra_existing_plants',
                        'other_id_index' => 'rra_no',
                        'index_data_type' => 'string'
                    ]);
                    $RraCommunityInstitutionQuery = $this->DynamicDelete([
                        'current_id' => $request->rra_no,
                        'tableName' => 'rra_community_institutions',
                        'other_id_index' => 'rra_no',
                        'index_data_type' => 'string'
                    ]);
                    $RraOrganicPotentialsQuery = $this->DynamicDelete([
                        'current_id' => $request->rra_no,
                        'tableName' => 'rra_organic_potentials',
                        'other_id_index' => 'rra_no',
                        'index_data_type' => 'string'
                    ]);
                    $RraProductionMarketingQuery = $this->DynamicDelete([
                        'current_id' => $request->rra_no,
                        'tableName' => 'rra_production_marketings',
                        'other_id_index' => 'rra_no',
                        'index_data_type' => 'string'
                    ]);
                    $RraInnovativeFarmerQuery = $this->DynamicDelete([
                        'current_id' => $request->rra_no,
                        'tableName' => 'rra_innovative_farmers',
                        'other_id_index' => 'rra_no',
                        'index_data_type' => 'string'
                    ]);
                    $RraDusunQuery = $this->DynamicDelete([
                        'current_id' => $request->rra_no,
                        'tableName' => 'rra_dusuns',
                        'other_id_index' => 'rra_no',
                        'index_data_type' => 'string'
                    ]);
                    //DB function
                    $mainRraResult = DB::delete($mainRraQuery);
                    $RraVillageBorderResult = DB::delete($RraVillageBorderQuery);
                    $RraLandUseResult = DB::delete($RraLandUseQuery);
                    $RraExistingPlantResult = DB::delete($RraExistingPlantQuery);
                    $RraComunityIntitutionResult = DB::delete($RraCommunityInstitutionQuery);
                    $RraOrganicPotentialResult = DB::delete($RraOrganicPotentialsQuery);
                    $RraProductionMarketingResult = DB::delete($RraProductionMarketingQuery);
                    $RraInnovativeFarmerResult = DB::delete($RraInnovativeFarmerQuery);
                    $RraDusunResult = DB::delete($RraDusunQuery);

                    // PRA
                    $mainPraQuery = $this->DynamicDelete([
                        'current_id' => $request->pra_no,
                        'tableName' => 'pras',
                        'other_id_index' => 'pra_no',
                        'index_data_type' => 'string'
                    ]);
                    $PraDisasterDetailQuery = $this->DynamicDelete([
                        'current_id' => $request->pra_no,
                        'tableName' => 'pra_disaster_details',
                        'other_id_index' => 'pra_no',
                        'index_data_type' => 'string'
                    ]);
                    $PraFertilizerDetailQuery = $this->DynamicDelete([
                        'current_id' => $request->pra_no,
                        'tableName' => 'pra_fertilizer_details',
                        'other_id_index' => 'pra_no',
                        'index_data_type' => 'string'
                    ]);
                    $PraPesticideDetailQuery = $this->DynamicDelete([
                        'current_id' => $request->pra_no,
                        'tableName' => 'pra_pesticide_details',
                        'other_id_index' => 'pra_no',
                        'index_data_type' => 'string'
                    ]);
                    $PraDryLandSpreadQuery = $this->DynamicDelete([
                        'current_id' => $request->pra_no,
                        'tableName' => 'pra_dry_land_spreads',
                        'other_id_index' => 'pra_no',
                        'index_data_type' => 'string'
                    ]);
                    $PraLandOwnershipQuery = $this->DynamicDelete([
                        'current_id' => $request->pra_no,
                        'tableName' => 'pra_land_ownerships',
                        'other_id_index' => 'pra_no',
                        'index_data_type' => 'string'
                    ]);
                    $PraWaterSourceQuery = $this->DynamicDelete([
                        'current_id' => $request->pra_no,
                        'tableName' => 'pra_watersource_details',
                        'other_id_index' => 'pra_no',
                        'index_data_type' => 'string'
                    ]);
                    $PraExistingProblemQuery = $this->DynamicDelete([
                        'current_id' => $request->pra_no,
                        'tableName' => 'pra_existing_problems',
                        'other_id_index' => 'pra_no',
                        'index_data_type' => 'string'
                    ]);
                    $PraFarmerIncomeQuery = $this->DynamicDelete([
                        'current_id' => $request->pra_no,
                        'tableName' => 'pra_farmer_incomes',
                        'other_id_index' => 'pra_no',
                        'index_data_type' => 'string'
                    ]);
                    $SocialImpactFaunaQuery = $this->DynamicDelete([
                        'current_id' => $request->pra_no,
                        'tableName' => 'socialimpact_fauna_details',
                        'other_id_index' => 'pra_no',
                        'index_data_type' => 'string'
                    ]);
                    $SocialImpactFloraQuery = $this->DynamicDelete([
                        'current_id' => $request->pra_no,
                        'tableName' => 'socialimpact_flora_details',
                        'other_id_index' => 'pra_no',
                        'index_data_type' => 'string'
                    ]);
                    //DB function
                    $mainPraResult = DB::delete($mainPraQuery);
                    $PraDisasterDetailResult = DB::delete($PraDisasterDetailQuery);
                    $PraFertilizerdetailResult = DB::delete($PraFertilizerDetailQuery);
                    $PraPesticideDetailResult = DB::delete($PraPesticideDetailQuery);
                    $PraDryLandSpreadsResult = DB::delete($PraDryLandSpreadQuery);
                    $PraLandOwnershipResult = DB::delete($PraLandOwnershipQuery);
                    $PraWaterSourceResult = DB::delete($PraWaterSourceQuery);
                    $PraExistingProblemResult = DB::delete($PraExistingProblemQuery);
                    $PraFarmerIncomeResult = DB::delete($PraFarmerIncomeQuery);
                    $SocialImpactFaunaResult = DB::delete($SocialImpactFaunaQuery);
                    $SocialImpactFloraResult = DB::delete($SocialImpactFloraQuery);


                    return response()->json([
                        'result_main_rra' => $mainRraResult,
                        'result_rra_village_border' => $RraVillageBorderResult,
                        'result_rra_land_use' => $RraLandUseResult,
                        'result_rra_existing_plant' => $RraExistingPlantResult,
                        'result_rra_community_institution' => $RraComunityIntitutionResult,
                        'result_rra_organic_potentials' => $RraOrganicPotentialResult,
                        'result_rra_production_marketing' => $RraProductionMarketingResult,
                        'result_rra_innovative_farmer' => $RraInnovativeFarmerResult,
                        'result_rra_dusun' => $RraDusunResult,

                        'result_main_pra' => $mainPraResult,
                        'result_pra_disaster_detail' => $PraDisasterDetailResult,
                        'result_pra_fertilizer_detail' => $PraFertilizerdetailResult,
                        'result_pra_pesticide_detail' => $PraPesticideDetailResult,
                        'result_pra_dry_land_spread' => $PraDryLandSpreadsResult,
                        'result_pra_land_ownership' => $PraLandOwnershipResult,
                        'result_pra_water_source' => $PraWaterSourceResult,
                        'result_pra_existing_problem' => $PraExistingProblemResult,
                        'result_pra_farmer_income' => $PraFarmerIncomeResult,
                        'result_social_impact_fauna' => $SocialImpactFaunaResult,
                        'result_social_impact_flora' => $SocialImpactFloraResult,
                    ], 200);
                }
            } else {
                return response()->json('Silahkan Pilih Tipe Hapus Terlebih Dahulu :D', 404);
            }



            // return result
        }

    }

    // Old Geko API
    // Scooping Visit
    public function GetScoopingAll(Request $request)
    {
        $userID = $request->user_id;

        $GetAllScooping = DB::table('scooping_visits')
            ->select(
                'scooping_visits.id',
                'scooping_visits.data_no',
                'scooping_visits.village',
                'scooping_visits.land_area',
                'scooping_visits.potential_dusun',
                'scooping_visits.start_scooping_date',
                'scooping_visits.end_scooping_date',
                'scooping_visits.user_id',
                'scooping_visits.verified_by',
                'scooping_visits.is_verify',
                'scooping_visits.created_at',
                'scooping_visits.status',
                'desas.name as village_name',
                'users.name as pic_name',
                'employees.name as pic_manager'
            )
            ->leftjoin('desas', 'desas.kode_desa', '=', 'scooping_visits.village')
            ->join('users', 'users.email', 'scooping_visits.user_id')
            ->join('employee_structure', 'employee_structure.nik', 'users.employee_no')
            ->leftjoin('employees', 'employees.nik', 'employee_structure.manager_code')
            ->where('scooping_visits.is_dell', '=', 0)
            ->orderBy('scooping_visits.created_at', 'desc');

        if ($userID) {
            $GetAllScooping = $GetAllScooping->whereIn('scooping_visits.user_id', explode(',', $userID));
        }
        $GetAllScooping = $GetAllScooping->get();

        $rslt = $this->ResultReturn(200, 'Success', $GetAllScooping);
        return response()->json($rslt, 200);
    }

    public function GetDetailScooping(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'data_no' => 'required',
        ]);

        if ($validator->fails()) {
            $rslt = $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        }

        $gis_data_no = $request->data_no;

        $GetScoopingDetail = DB::table('scooping_visits')
            ->select(
                'scooping_visits.*',
                'scooping_visits.altitude as land_height',
                'scooping_visits.slope as land_slope',
                'scooping_visits.goverment_place as government_place',
                'provinces.name as province_name',
                'kabupatens.name as city_name',
                'kecamatans.name as district_name',
                'desas.name as village_name'
            )
            ->join('provinces', 'provinces.province_code', 'scooping_visits.province')
            ->join('kabupatens', 'kabupatens.kabupaten_no', 'scooping_visits.city')
            ->join('kecamatans', 'kecamatans.kode_kecamatan', 'scooping_visits.district')
            ->join('desas', 'desas.kode_desa', 'scooping_visits.village')
            ->where('scooping_visits.data_no', '=', $gis_data_no)
            ->first();

        $GetScoopingDetail->scooping_figures = DB::table('scooping_visit_figures')
            ->select('scooping_visit_figures.*')
            ->where('data_no', '=', $gis_data_no)->get();

        $rslt = $this->ResultReturn(200, 'success', $GetScoopingDetail);
        return response()->json($rslt, 200);
    }

    public function AddScooping(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'village' => 'required',
        ]);

        if ($validator->fails()) {
            $rslt = $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        }

        $scooping_no = ScoopingVisit::Maxno();

        $scooping = ScoopingVisit::create([
            'data_no' => $scooping_no,
            'province' => $request->province,
            'city' => $request->city,
            'district' => $request->district,
            'village' => $request->village,
            'start_scooping_date' => $request->start_scooping_date,
            'end_scooping_date' => $request->end_scooping_date,
            'accessibility' => $request->accessibility,
            'land_area' => $request->land_area,
            'land_type' => $request->land_type,
            'slope' => $request->slope,
            'altitude' => $request->altitude,
            'vegetation_density' => $request->vegetation_density,
            'water_source' => $request->water_source,
            'rainfall' => $request->rainfall,
            'agroforestry_type' => $request->agroforestry_type,
            'goverment_place' => $request->government_place,
            'land_coverage' => $request->land_coverage,
            'electricity_source' => $request->electricity_source,
            'dry_land_area' => $request->dry_land_area,
            'village_polygon' => $request->village_polygon,
            'dry_land_polygon' => $request->dry_land_polygon,
            'total_dusun' => $request->total_dusun,
            'potential_dusun' => $request->potential_dusun,
            'potential_description' => $request->potential_description,
            'total_male' => $request->total_male,
            'total_female' => $request->total_female,
            'total_kk' => $request->total_kk,
            'photo_road_access' => $request->photo_road_access,
            'photo_meeting' => $request->photo_meeting,
            'photo_dry_land' => $request->photo_dry_land,
            'village_profile' => $request->village_profile,
            'status' => $request->status,
            'complete_data' => '0',
            'is_dell' => '0',
            'user_id' => $request->user_id ?? Auth::user()->email ?? '-',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ]);

        $village_figures = $request->village_figures;

        foreach ($village_figures as $value) {
            ScoopingVisitFigure::create([
                'data_no' => $scooping_no,
                'name' => $value['name'],
                'position' => $value['position'],
                'phone' => $value['phone'],
                'whatsapp' => $value['whatsapp'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]);
        }

        // $logData = [
        //     'status' => 'Created Scooping',
        //     'data_no' => $data_no
        // ];
        // $this->createLog($logData);

        $rslt = $this->ResultReturn(200, 'success', $scooping_no);
        return response()->json($rslt, 200);
    }

    public function UpdateScooping(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'data_no' => 'required',
        ]);

        if ($validator->fails()) {
            $rslt = $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        }

        ScoopingVisit::where('data_no', '=', $request->data_no)
            ->update([
                'province' => $request->province,
                'city' => $request->city,
                'district' => $request->district,
                'village' => $request->village,
                'start_scooping_date' => $request->start_scooping_date,
                'end_scooping_date' => $request->end_scooping_date,
                'accessibility' => $request->accessibility,
                'land_area' => $request->land_area,
                'land_type' => $request->land_type,
                'slope' => $request->slope,
                'altitude' => $request->altitude,
                'vegetation_density' => $request->vegetation_density,
                'water_source' => $request->water_source,
                'rainfall' => $request->rainfall,
                'agroforestry_type' => $request->agroforestry_type,
                'goverment_place' => $request->government_place,
                'land_coverage' => $request->land_coverage,
                'electricity_source' => $request->electricity_source,
                'dry_land_area' => $request->dry_land_area,
                'village_polygon' => $request->village_polygon,
                'dry_land_polygon' => $request->dry_land_polygon,
                'total_dusun' => $request->total_dusun,
                'potential_dusun' => $request->potential_dusun,
                'potential_description' => $request->potential_description,
                'total_male' => $request->total_male,
                'total_female' => $request->total_female,
                'total_kk' => $request->total_kk,
                'status' => $request->status,
                'updated_at' => Carbon::now(),
                'updated_by' => Auth::user()->email
            ]);
        if ($request->photo_road_access) {
            ScoopingVisit::where('data_no', '=', $request->data_no)->update([
                'photo_road_access' => $request->photo_road_access,
            ]);
        }
        if ($request->photo_meeting) {
            ScoopingVisit::where('data_no', '=', $request->data_no)->update([
                'photo_meeting' => $request->photo_meeting,
            ]);
        }
        if ($request->photo_dry_land) {
            ScoopingVisit::where('data_no', '=', $request->data_no)->update([
                'photo_dry_land' => $request->photo_dry_land,
            ]);
        }
        if ($request->village_profile) {
            ScoopingVisit::where('data_no', '=', $request->data_no)->update([
                'village_profile' => $request->village_profile,
            ]);
        }

        $rslt = $this->ResultReturn(200, 'success', $request->data_no);
        return response()->json($rslt, 200);
    }

    public function VerificationScooping(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'data_no' => 'required',
        ]);

        if ($validator->fails()) {
            $rslt = $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        }

        $form_data_no = $request->data_no;
        $scooping = DB::table('scooping_visits')->where('data_no', '=', $form_data_no)->first();

        if ($scooping) {
            ScoopingVisit::where('data_no', '=', $form_data_no)
                ->update([
                    'verified_at' => Carbon::now(),
                    'verified_by' => Auth::user()->email,
                    'is_verify' => 1,
                    'status' => 'submit_review'
                ]);

            // $this->createLogs([
            //     'status'=>'Verified Social Officer',
            //     'organic_no'=>$form_data_no
            // ]);

            $rslt = $this->ResultReturn(200, 'success', 'success');
            return response()->json($rslt, 200);
        } else {
            $rslt = $this->ResultReturn(400, 'doesnt match data', 'doesnt match data');
            return response()->json($rslt, 400);
        }
    }

    public function VerificationPMScooping(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'data_no' => 'required',
            'verified_by' => 'required',
        ]);

        if ($validator->fails()) {
            $rslt = $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        }

        $form_data_no = $request->data_no;
        $scooping = DB::table('scooping_visits')->where('data_no', '=', $form_data_no)->first();

        if ($scooping) {
            ScoopingVisit::where('data_no', '=', $form_data_no)
                ->update([
                    'updated_at' => Carbon::now(),
                    'verified_by' => $request->verified_by,
                    'is_verify' => 2
                ]);

            // $this->createLogs([
            //     'is_verify'=>'Verified Program Manager',
            //     'organic_no'=>$form_data_no
            // ]);

            $rslt = $this->ResultReturn(200, 'success', 'success');
            return response()->json($rslt, 200);
        } else {
            $rslt = $this->ResultReturn(400, 'doesnt match data', 'doesnt match data');
            return response()->json($rslt, 400);
        }
    }

    public function UnverificationScooping(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'data_no' => 'required',
            'verified_by' => 'required',
        ]);

        if ($validator->fails()) {
            $rslt = $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        }

        $form_data_no = $request->data_no;
        $scooping = DB::table('scooping_visits')->where('data_no', '=', $form_data_no)->first();

        if ($scooping) {
            ScoopingVisit::where('data_no', '=', $form_data_no)
                ->update([
                    'updated_at' => Carbon::now(),
                    'status' => 'document_saving',
                    'verified_by' => '-',
                    'is_verify' => 0
                ]);

            // $this->createLogs([
            //     'is_verify'=>'Unverified',
            //     'organic_no'=>$form_data_no
            // ]);

            $rslt = $this->ResultReturn(200, 'success', 'success');
            return response()->json($rslt, 200);
        } else {
            $rslt = $this->ResultReturn(400, 'doesnt match data', 'doesnt match data');
            return response()->json($rslt, 400);
        }
    }

    public function MailtoGis(Request $request)
    {
        $gis_data_no = $request->data_no;

        $GetScoopingDetail = DB::table('scooping_visits')
            ->select(
                'scooping_visits.*',
                'scooping_visits.altitude as land_height',
                'scooping_visits.slope as land_slope',
                'scooping_visits.goverment_place as government_place',
                'provinces.name as province_name',
                'kabupatens.name as city_name',
                'kecamatans.name as district_name',
                'desas.name as village_name'
            )->join('provinces', 'provinces.province_code', 'scooping_visits.province')
            ->join('kabupatens', 'kabupatens.kabupaten_no', 'scooping_visits.city')
            ->join('kecamatans', 'kecamatans.kode_kecamatan', 'scooping_visits.district')
            ->join('desas', 'desas.kode_desa', 'scooping_visits.village')
            ->where('scooping_visits.data_no', '=', $gis_data_no)
            ->first();

        $data = ['data' => $GetScoopingDetail];

        //$data = array('name'=>"Notification to GIS Officer about Scooping Visit");
        // Path or name to the blade template to be rendered
        $template_path = 'email_template';

        Mail::send(['html' => $template_path], $data, function ($message) use ($request) {
            // Set the receiver and subject of the mail.
            // $message->to('haryadi@trees4trees.org', 'Mas Haryadi')->subject('GIS Mailing');
            $message->to('edo.setiawan@trees4trees.org', 'Master GEDOOO')->subject('GIS Mailing');
            // Set the sender
            $message->from('eaunggelia.triandi@trees4trees.org', 'Notification to GIS Officer about Scooping Visit');
        });

        // return $template_path;
        ScoopingVisit::where('data_no', '=', $GetScoopingDetail->data_no)
            ->update([
                'updated_at' => Carbon::now(),
                'email_to_gis' => $GetScoopingDetail->email_to_gis + 1
            ]);

        return response()->json("Email to GIS Officer sent, check your inbox.");
        ;
    }
    public function MailToSocialOfficer(Request $request)
    {
        $SO_data_no = $request->data_no;

        $GetScoopingDetail = DB::table('scooping_visits')
            ->select(
                'scooping_visits.*',
                'scooping_visits.altitude as land_height',
                'scooping_visits.slope as land_slope',
                'scooping_visits.goverment_place as government_place',
                'provinces.name as province_name',
                'kabupatens.name as city_name',
                'kecamatans.name as district_name',
                'desas.name as village_name'
            )->join('provinces', 'provinces.province_code', 'scooping_visits.province')
            ->join('kabupatens', 'kabupatens.kabupaten_no', 'scooping_visits.city')
            ->join('kecamatans', 'kecamatans.kode_kecamatan', 'scooping_visits.district')
            ->join('desas', 'desas.kode_desa', 'scooping_visits.village')
            ->where('scooping_visits.data_no', '=', $SO_data_no)
            ->first();

        $data = ['data' => $GetScoopingDetail];

        //$data = array('name'=>"Notification to GIS Officer about Scooping Visit");
        // Path or name to the blade template to be rendered
        $template_path = 'email_scooping_tamplate';

        Mail::send(['html' => $template_path], $data, function ($message) use ($request) {
            // Set the receiver and subject of the mail.
            // $message->to('haryadi@trees4trees.org', 'Mas Haryadi')->subject('GIS Mailing');
            $message->to('edo.setiawan@trees4trees.org', 'eaunggelia.triandi@trees4trees.org')->subject('[GEKO Mailing] Scooping Visit');
            // Set the sender
            $message->from('eaunggelia.triandi@trees4trees.org', 'Notification to Social Officer about Scooping Visit Verification');
        });

        // return $template_path;
        ScoopingVisit::where('data_no', '=', $GetScoopingDetail->data_no);
        return response()->json("Email to Social Officer sent, check your inbox.");
    }
    public function EmailtoGis()
    {
        Mail::to('kresna@trees4trees.org')->send(new NotifyMail());

        if (Mail::failures()) {
            return response()->Fail('Sorry! Please try again latter');
        } else {
            return response()->success('Great! Successfully send in your mail');
        }
    }


    //RRA-PRA    

    public function GetRraPraAll(Request $request)
    {
        $GetAllRra = DB::table('rras')
            ->select(
                'rras.id',
                'rras.form_no',
                'rras.village',
                'rras.rra_pra_date_start',
                'rras.rra_pra_date_end',
                'rras.user_id',
                'rras.verified_by',
                'rras.is_verify',
                'rras.created_at',
                'rras.status',
                'desas.name as village_name',
                'users.name as pic_name',
                'employees.name as pic_manager'
            )
            ->leftjoin('desas', 'desas.kode_desa', '=', 'rras.village')
            ->join('users', 'users.email', 'rras.user_id')
            ->join('employee_structure', 'employee_structure.nik', 'users.employee_no')
            ->leftjoin('employees', 'employees.nik', 'employee_structure.manager_code')
            ->where('rras.is_dell', '=', 0)
            ->orderBy('rras.created_at', 'desc')
            ->get();
        $rslt = $this->ResultReturn(200, 'Success', $GetAllRra);
        return response()->json($rslt, 200);
    }

    public function GetDetailRraPra(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'form_no' => 'required',
        ]);

        if ($validator->fails()) {
            $rslt = $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        }

        $scooping_form_no = $request->form_no;

        $GetScoopingDetail = DB::table('scooping_visits')
            ->select(
                'scooping_visits.*',
                'scooping_visits.altitude as land_height',
                'scooping_visits.slope as land_slope',
                'scooping_visits.goverment_place as government_place',
                'provinces.name as province_name',
                'kabupatens.name as city_name',
                'kecamatans.name as district_name',
                'desas.name as village_name'
            )
            ->join('provinces', 'provinces.province_code', 'scooping_visits.province')
            ->join('kabupatens', 'kabupatens.kabupaten_no', 'scooping_visits.city')
            ->join('kecamatans', 'kecamatans.kode_kecamatan', 'scooping_visits.district')
            ->join('desas', 'desas.kode_desa', 'scooping_visits.village')
            ->where('scooping_visits.data_no', '=', $scooping_form_no)
            ->first();

        $GetScoopingDetail->scooping_figures = DB::table('scooping_visit_figures')
            ->select('scooping_visit_figures.*')
            ->where('scooping_visit_figures.data_no', '=', $scooping_form_no)->get();

        $GetRraDetail = DB::table('rras')
            ->select(
                'rras.*',
                'desas.name as village_name'
            )
            ->join('desas', 'desas.kode_desa', 'rras.village')
            ->where('rras.form_no', '=', $scooping_form_no)
            ->first();

        $GetRraDetail->VillageBorder = DB::table('village_borders')
            ->select(
                'village_borders.*',
                'kabupatens.name as city_name',
                'kecamatans.name as district_name',
                'desas.name as village_name'
            )
            ->join('kabupatens', 'kabupatens.kabupaten_no', 'village_borders.kabupaten_no')
            ->join('kecamatans', 'kecamatans.kode_kecamatan', 'village_borders.kode_kecamatan')
            ->join('desas', 'desas.kode_desa', 'village_borders.kode_desa')
            ->where('rra_no', '=', $GetRraDetail->rra_no)->get();

        $GetRraDetail->CommunityInstitution = DB::table('rra_community_institutions')
            ->select('rra_community_institutions.*')
            ->where('rra_no', '=', $GetRraDetail->rra_no)->get();

        $GetRraDetail->Dusun = DB::table('rra_dusuns')
            ->select('rra_dusuns.*')
            ->where('rra_no', '=', $GetRraDetail->rra_no)->get();

        $GetRraDetail->ExistingPlant = DB::table('rra_existing_plants')
            ->select('rra_existing_plants.*')
            ->where('rra_no', '=', $GetRraDetail->rra_no)->get();

        $GetRraDetail->InnovativeFarmer = DB::table('rra_innovative_farmers')
            ->select('rra_innovative_farmers.*')
            ->where('rra_no', '=', $GetRraDetail->rra_no)->get();

        $GetRraDetail->LandUse = DB::table('rra_land_uses')
            ->select('rra_land_uses.*')
            ->where('rra_no', '=', $GetRraDetail->rra_no)->get();

        $GetRraDetail->OrganicPotential = DB::table('rra_organic_potentials')
            ->select('rra_organic_potentials.*')
            ->where('rra_no', '=', $GetRraDetail->rra_no)->get();

        $GetRraDetail->ProductionMarketing = DB::table('rra_production_marketings')
            ->select('rra_production_marketings.*')
            ->where('rra_no', '=', $GetRraDetail->rra_no)->get();



        $GetPraDetail = DB::table('pras')
            ->select('pras.*')
            ->where('pras.form_no', '=', $scooping_form_no)
            ->first();
        if ($GetPraDetail) {
            $GetPraDetail->DisasterHistory = DB::table('pra_disaster_details')
                ->select('pra_disaster_details.*')
                ->where('pra_no', '=', $GetPraDetail->pra_no)->get();

            $GetPraDetail->ExistingProblem = DB::table('pra_existing_problems')
                ->select('pra_existing_problems.*')
                ->where('pra_no', '=', $GetPraDetail->pra_no)->get();

            $GetPraDetail->FarmerIncome = DB::table('pra_farmer_incomes')
                ->select('pra_farmer_incomes.*')
                ->where('pra_no', '=', $GetPraDetail->pra_no)->get();

            $GetPraDetail->Fertilizer = DB::table('pra_fertilizer_details')
                ->select('pra_fertilizer_details.*')
                ->where('pra_no', '=', $GetPraDetail->pra_no)->get();

            $GetPraDetail->Pesticide = DB::table('pra_pesticide_details')
                ->select('pra_pesticide_details.*')
                ->where('pra_no', '=', $GetPraDetail->pra_no)->get();

            $GetPraDetail->DryLandSpread = DB::table('pra_dry_land_spreads')
                ->select('pra_dry_land_spreads.*')
                ->where('pra_no', '=', $GetPraDetail->pra_no)->get();

            $GetPraDetail->Watersource = DB::table('pra_watersource_details')
                ->select('pra_watersource_details.*')
                ->where('pra_no', '=', $GetPraDetail->pra_no)->get();

            $GetPraDetail->LandOwnership = DB::table('pra_land_ownerships')
                ->select('pra_land_ownerships.*')
                ->where('pra_no', '=', $GetPraDetail->pra_no)->get();

            $GetPraDetail->Flora = DB::table('socialimpact_flora_details')
                ->select('socialimpact_flora_details.*')
                ->where('pra_no', '=', $GetPraDetail->pra_no)->get();

            $GetPraDetail->Fauna = DB::table('socialimpact_fauna_details')
                ->select('socialimpact_fauna_details.*')
                ->where('pra_no', '=', $GetPraDetail->pra_no)->get();
        }


        $rslt = $this->ResultReturn(200, 'success', ['Scooping' => $GetScoopingDetail, 'RRA' => $GetRraDetail, 'PRA' => $GetPraDetail]);
        return response()->json($rslt, 200);
    }

    public function AddRraPra(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'form_no' => 'required',
        ]);

        if ($validator->fails()) {
            $rslt = $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        }

        $rra_no = Rra::Maxno();
        $pra_no = Pra::Maxno();
        $form_no = $request->form_no;

        $rra_main = Rra::create([
            'rra_no' => $rra_no,
            'form_no' => $request->form_no,
            'rra_pra_date_start' => $request->rra_pra_date_start,
            'rra_pra_date_end' => $request->rra_pra_date_end,
            'village' => $request->village,
            'lahan_menurut_masyarakat' => $request->lahan_menurut_masyarakat,
            'tanah_sawah' => $request->tanah_sawah,
            'tegal_ladang' => $request->tegal_ladang,
            'pemukiman' => $request->pemukiman,
            'pekarangan' => $request->pekarangan,
            'tanah_rawa' => $request->tanah_rawa,
            'waduk_danau' => $request->waduk_danau,
            'tanah_perkebunan_rakyat' => $request->tanah_perkebunan_rakyat,
            'tanah_perkebunan_negara' => $request->tanah_perkebunan_negara,
            'tanah_perkebunan_swasta' => $request->tanah_perkebunan_swasta,
            'hutan_lindung' => $request->hutan_lindung,
            'hutan_rakyat' => $request->hutan_rakyat,

            'fasilitas_umum' => $request->fasilitas_umum,
            'complete_data' => '0',
            'is_dell' => '0',
            'user_id' => $request->user_id ?? Auth::user()->email ?? '-',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
            'commodity_photo' => $request->commodity_photo,
            'institution_photo' => $request->institution_photo,
            'organic_farming_photo' => $request->organic_farming_photo,
            'status' => $request->status
        ]);

        $village_border = $request->village_border;
        $land_use_patterns = $request->land_use_patterns;
        $existing_plants = $request->existing_plants;
        $community_institutions = $request->community_institutions;
        $organic_farming_potential = $request->organic_farming_potential;
        $production_marketing = $request->production_marketing;
        $identification_of_innovative_farmers = $request->identification_of_innovative_farmers;
        $dusuns = $request->dusuns;

        foreach ($village_border as $value) {
            VillageBorder::create([
                'rra_no' => $rra_no,
                'point' => $value['point'],
                'border_type' => $value['border_type'],
                'kabupaten_no' => $value['kabupaten_no'],
                'kode_kecamatan' => $value['kode_kecamatan'],
                'kode_desa' => $value['kode_desa'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]);
        }

        foreach ($land_use_patterns as $value) {
            RraLandUse::create([
                'rra_no' => $rra_no,
                'pattern' => $value['pattern'],
                'plant' => $value['plant'] ? implode(',', $value['plant']) : '',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]);
        }

        foreach ($existing_plants as $value) {
            RraExistingPlant::create([
                'rra_no' => $rra_no,
                'plant_type' => $value['plant_type'],
                'plant' => $value['plant'] ? implode(',', $value['plant']) : '',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]);
        }

        foreach ($community_institutions as $value) {
            RraCommunityInstitution::create([
                'rra_no' => $rra_no,
                'institution_name' => $value['institution_name'],
                'role' => $value['role'] ? implode(',', $value['role']) : '',
                'description' => $value['description'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]);
        }

        foreach ($organic_farming_potential as $value) {
            RraOrganicPotential::create([
                'rra_no' => $rra_no,
                'potential_category' => $value['potential_category'],
                'source' => $value['source'],
                'name' => $value['name'],
                'description' => $value['description'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]);
        }

        foreach ($production_marketing as $value) {
            RraProductionMarketing::create([
                'rra_no' => $rra_no,
                'commodity_name' => $value['commodity_name'],
                'capacity' => $value['capacity'],
                'method' => $value['method'],
                'period' => $value['period'],
                'description' => $value['description'],
                'customer' => $value['customer'],
                'phone' => $value['phone'],
                'email' => $value['email'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
                'capacity_switcher' => $value['capacity_switcher'],
                'has_customer' => $value['has_customer']
            ]);
        }

        foreach ($identification_of_innovative_farmers as $value) {
            RraInnovativeFarmer::create([
                'rra_no' => $rra_no,
                'farmer_name' => $value['farmer_name'],
                'specialitation' => $value['specialitation'],
                'potential' => $value['potential'],
                'description' => $value['description'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]);
        }

        foreach ($dusuns as $value) {
            RraDusun::create([
                'rra_no' => $rra_no,
                'dusun_name' => $value['dusun_name'],
                'potential' => $value['potential'],
                'land_area' => $value['land_area'],
                'accessibility' => $value['accessibility'],
                'dry_land_area' => $value['dry_land_area'],
                'pic_dusun' => $value['pic_dusun'],
                'position' => $value['position'],
                'phone' => $value['phone'],
                'whatsapp' => $value['whatsapp'],
                'total_rw' => $value['total_rw'],
                'total_rt' => $value['total_rt'],
                'total_male' => $value['total_male'],
                'total_female' => $value['total_female'],
                'total_kk' => $value['total_kk'],
                'total_farmer_family' => $value['total_farmer_family'],
                'average_family_member' => $value['average_family_member'],
                'average_farmer_family_member' => $value['average_farmer_family_member'],
                'education_elementary_junior_hs' => $value['education_elementary_junior_hs'],
                'education_senior_hs' => $value['education_senior_hs'],
                'education_college' => $value['education_college'],
                'age_productive' => $value['age_productive'],
                'age_non_productive' => $value['age_non_productive'],
                'job_farmer' => $value['job_farmer'],
                'job_farm_workers' => $value['job_farm_workers'],
                'job_private_employee' => $value['job_private_employee'],
                'job_state_employee' => $value['job_state_employee'],
                'job_enterpreneur' => $value['job_enterpreneur'],
                'job_others' => $value['job_others'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
                'dusun_access_photo' => $value['dusun_access_photo'],
                'data_land_area_source' => $value['data_land_area_source'],
                'data_dry_land_area_source' => $value['data_dry_land_area_source'],
                'has_detail_kk' => $value['has_detail_kk'],
                'total_non_farmer_family' => $value['total_non_farmer_family'],
                'has_avg_member' => $value['has_avg_member'],
                'has_detail_avg_member' => $value['has_detail_avg_member'],
                'average_non_farmer_family_member' => $value['average_non_farmer_family_member'],
                'data_productive_source' => $value['data_productive_source'],
                'data_job_source' => $value['data_job_source'],
                'job_farmer_switcher' => $value['job_farmer_switcher'],
                'job_farm_workers_switcher' => $value['job_farm_workers_switcher'],
                'job_private_employee_switcher' => $value['job_private_employee_switcher'],
                'job_state_employee_switcher' => $value['job_state_employee_switcher'],
                'job_enterpreneur_switcher' => $value['job_enterpreneur_switcher'],
                'job_others_switcher' => $value['job_others_switcher']
            ]);
        }

        $pra_main = Pra::create([
            'pra_no' => $pra_no,
            'form_no' => $request->form_no,
            'land_ownership_description' => $request->land_ownership_description,
            'distribution_of_critical_land_locations_description' => $request->distribution_of_critical_land_locations_description,
            'collection_type' => $request->collection_type,
            'man_min_income' => $request->man_min_income,
            'man_max_income' => $request->man_max_income,
            'man_income_source' => $request->man_income_source,
            'man_commodity_name' => $request->man_commodity_name,
            'man_method' => $request->man_method,
            'man_average_capacity' => $request->man_average_capacity,
            'man_marketing' => $request->man_marketing,
            'man_period' => $request->man_period,
            'man_source' => $request->man_source,
            'woman_min_income' => $request->woman_min_income,
            'woman_max_income' => $request->woman_max_income,
            'woman_income_source' => $request->woman_income_source,
            'woman_commodity_name' => $request->woman_commodity_name,
            'woman_method' => $request->woman_method,
            'woman_average_capacity' => $request->woman_average_capacity,
            'woman_marketing' => $request->woman_marketing,
            'woman_period' => $request->woman_period,
            'woman_source' => $request->woman_source,
            'income_description' => $request->income_description,
            'land_utilization_source' => $request->land_utilization_source,
            'land_utilization_plant_type' => $request->land_utilization_plant_type ? implode(',', $request->land_utilization_plant_type) : '',
            'land_utilization_description' => $request->land_utilization_description,
            'pra_watersource_description' => $request->pra_watersource_description,
            'complete_data' => '0',
            'is_dell' => '0',
            'user_id' => $request->user_id ?? Auth::user()->email ?? '-',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
            'dry_land_photo' => $request->dry_land_photo,
            'dry_land_photo2' => $request->dry_land_photo2,
            'watersource_photo' => $request->watersource_photo,
            'status' => $request->status
        ]);

        $pra_disaster = $request->disaster_history;
        $pra_fertilizer = $request->pra_fertilizer;
        $pra_pesticide = $request->pra_pesticide;
        $land_ownership = $request->land_ownership;
        $pra_watersource = $request->pra_watersource;
        $existing_problem = $request->problem_existing;
        $dry_land = $request->distribution_of_critical_land_locations;
        $farmer_income = $request->farmer_income;
        $sosfauna = $request->fauna_data;
        $sosflora = $request->flora_data;

        foreach ($pra_disaster as $value) {
            PraDisasterDetail::create([
                'pra_no' => $pra_no,
                'disaster_name' => $value['disaster_name'],
                'disaster_categories' => $value['disaster_categories'],
                'year' => $value['year'],
                'fatalities' => $value['fatalities'],
                'has_fatalities' => $value['has_fatalities'],
                'detail' => $value['detail'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]);
        }

        foreach ($pra_fertilizer as $value) {
            PraFertilizerDetail::create([
                'pra_no' => $pra_no,
                'fertilizer_categories' => $value['fertilizer_categories'],
                'fertilizer_type' => $value['fertilizer_type'],
                'fertilizer_name' => $value['fertilizer_name'],
                'fertilizer_source' => $value['fertilizer_source'],
                'fertilizer_description' => $value['fertilizer_description'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]);
        }

        foreach ($pra_pesticide as $value) {
            PraPesticideDetail::create([
                'pra_no' => $pra_no,
                'pesticide_categories' => $value['pesticide_categories'],
                'pesticide_type' => $value['pesticide_type'],
                'pesticide_name' => $value['pesticide_name'],
                'pesticide_source' => $value['pesticide_source'],
                'pesticide_description' => $value['pesticide_description'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]);
        }

        foreach ($dry_land as $value) {
            PraDryLandSpread::create([
                'pra_no' => $pra_no,
                'dusun_name' => $value['dusun_name'],
                'type_utilization' => $value['type_utilization'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]);
        }

        foreach ($land_ownership as $value) {
            PraLandOwnership::create([
                'pra_no' => $pra_no,
                'type_ownership' => $value['type_ownership'],
                'land_ownership' => $value['land_ownership'],
                'percentage' => $value['percentage'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]);
        }

        foreach ($pra_watersource as $value) {
            PraWatersourceDetail::create([
                'pra_no' => $pra_no,
                'watersource_name' => $value['watersource_name'],
                'watersource_type' => $value['watersource_type'],
                'watersource_condition' => $value['watersource_condition'],
                'consumption' => $value['consumption'],
                'watersource_utilization' => $value['watersource_utilization'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]);
        }

        foreach ($existing_problem as $value) {
            PraExistingProblem::create([
                'pra_no' => $pra_no,
                'problem_categories' => $value['problem_categories'],
                'problem_name' => $value['problem_name'],
                'problem_source' => $value['problem_source'],
                'problem_solution' => $value['problem_solution'],
                'date' => $value['date'],
                'impact_to_people' => $value['impact_to_people'],
                'interval_problem' => $value['interval_problem'],
                'priority' => $value['priority'],
                'potential' => $value['potential'],
                'total_value' => $value['total_value'],
                'ranking' => $value['ranking'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]);
        }

        foreach ($farmer_income as $value) {
            PraFarmerIncome::create([
                'pra_no' => $pra_no,
                'name' => $value['name'],
                'gender' => $value['gender'],
                'source' => $value['source'],
                'source_income' => $value['source_income'],
                'capacity' => $value['capacity'],
                'commodity_name' => $value['commodity_name'],
                'family_member' => $value['family_member'],
                'family_type' => $value['family_type'],
                'indirect_method' => $value['indirect_method'],
                'job' => $value['job'],
                'method' => $value['method'],
                'period' => $value['period'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]);
        }

        foreach ($sosfauna as $value) {
            SocialimpactFaunaDetail::create([
                'pra_no' => $pra_no,
                'fauna_categories' => $value['fauna_categories'],
                'fauna_name' => $value['fauna_name'],
                'fauna_population' => $value['fauna_population'],
                'fauna_foodsource' => $value['fauna_foodsource'],
                'fauna_status' => $value['fauna_status'],
                'fauna_habitat' => $value['fauna_habitat'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]);
        }

        foreach ($sosflora as $value) {
            SocialimpactFloraDetail::create([
                'pra_no' => $pra_no,
                'flora_categories' => $value['flora_categories'],
                'flora_name' => $value['flora_name'],
                'flora_population' => $value['flora_population'],
                'flora_foodsource' => $value['flora_foodsource'],
                'flora_status' => $value['flora_status'],
                'flora_habitat' => $value['flora_habitat'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]);
        }

        // $logData = [
        //     'status' => 'Created Scooping',
        //     'data_no' => $data_no
        // ];
        // $this->createLog($logData);

        $rslt = $this->ResultReturn(200, 'success', 'success');
        return response()->json($rslt, 200);
    }

    public function UpdateRraPra(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'form_no' => 'required',
        ]);

        if ($validator->fails()) {
            $rslt = $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        }

        $form_no = $request->form_no;

        $rra = Rra::where('form_no', '=', $request->form_no)->first();

        $rra_main = Rra::where('form_no', '=', $request->form_no)->update([
            'rra_pra_date_start' => $request->rra_pra_date_start,
            'rra_pra_date_end' => $request->rra_pra_date_end,
            'village' => $request->village,
            'lahan_menurut_masyarakat' => $request->lahan_menurut_masyarakat,
            'tanah_sawah' => $request->tanah_sawah,
            'tegal_ladang' => $request->tegal_ladang,
            'pemukiman' => $request->pemukiman,
            'pekarangan' => $request->pekarangan,
            'tanah_rawa' => $request->tanah_rawa,
            'waduk_danau' => $request->waduk_danau,
            'tanah_perkebunan_rakyat' => $request->tanah_perkebunan_rakyat,
            'tanah_perkebunan_negara' => $request->tanah_perkebunan_negara,
            'tanah_perkebunan_swasta' => $request->tanah_perkebunan_swasta,
            'hutan_lindung' => $request->hutan_lindung,
            'hutan_rakyat' => $request->hutan_rakyat,
            'fasilitas_umum' => $request->fasilitas_umum,
            'complete_data' => '0',
            'is_dell' => '0',
            'updated_at' => Carbon::now(),
            'commodity_photo' => $request->commodity_photo,
            'institution_photo' => $request->institution_photo,
            'organic_farming_photo' => $request->organic_farming_photo,
            'status' => $request->status
        ]);

        $village_border = $request->village_border;
        $land_use_patterns = $request->land_use_patterns;
        $existing_plants = $request->existing_plants;
        $community_institutions = $request->community_institutions;
        $organic_farming_potential = $request->organic_farming_potential;
        $production_marketing = $request->production_marketing;
        $identification_of_innovative_farmers = $request->identification_of_innovative_farmers;
        $dusuns = $request->dusuns;

        VillageBorder::where('rra_no', '=', $rra->rra_no)->delete();
        RraLandUse::where('rra_no', '=', $rra->rra_no)->delete();
        RraExistingPlant::where('rra_no', '=', $rra->rra_no)->delete();
        RraCommunityInstitution::where('rra_no', '=', $rra->rra_no)->delete();
        RraOrganicPotential::where('rra_no', '=', $rra->rra_no)->delete();
        RraProductionMarketing::where('rra_no', '=', $rra->rra_no)->delete();
        RraInnovativeFarmer::where('rra_no', '=', $rra->rra_no)->delete();
        RraDusun::where('rra_no', '=', $rra->rra_no)->delete();

        foreach ($village_border as $value) {
            VillageBorder::create([
                'rra_no' => $rra->rra_no,
                'point' => $value['point'],
                'border_type' => $value['border_type'],
                'kabupaten_no' => $value['kabupaten_no'],
                'kode_kecamatan' => $value['kode_kecamatan'],
                'kode_desa' => $value['kode_desa'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]);
        }

        foreach ($land_use_patterns as $value) {
            RraLandUse::create([
                'rra_no' => $rra->rra_no,
                'pattern' => $value['pattern'],
                'plant' => $value['plant'] ? implode(',', $value['plant']) : '',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]);
        }

        foreach ($existing_plants as $value) {
            RraExistingPlant::create([
                'rra_no' => $rra->rra_no,
                'plant_type' => $value['plant_type'],
                'plant' => $value['plant'] ? implode(',', $value['plant']) : '',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]);
        }

        foreach ($community_institutions as $value) {
            RraCommunityInstitution::create([
                'rra_no' => $rra->rra_no,
                'institution_name' => $value['institution_name'],
                'role' => $value['role'] ? implode(',', $value['role']) : '',
                'description' => $value['description'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]);
        }

        foreach ($organic_farming_potential as $value) {
            RraOrganicPotential::create([
                'rra_no' => $rra->rra_no,
                'potential_category' => $value['potential_category'],
                'source' => $value['source'],
                'name' => $value['name'],
                'description' => $value['description'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]);
        }

        foreach ($production_marketing as $value) {
            RraProductionMarketing::create([
                'rra_no' => $rra->rra_no,
                'commodity_name' => $value['commodity_name'],
                'capacity' => $value['capacity'],
                'method' => $value['method'],
                'period' => $value['period'],
                'description' => $value['description'],
                'customer' => $value['customer'],
                'phone' => $value['phone'],
                'email' => $value['email'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
                'capacity_switcher' => $value['capacity_switcher'],
                'has_customer' => $value['has_customer']
            ]);
        }

        foreach ($identification_of_innovative_farmers as $value) {
            RraInnovativeFarmer::create([
                'rra_no' => $rra->rra_no,
                'farmer_name' => $value['farmer_name'],
                'specialitation' => $value['specialitation'],
                'potential' => $value['potential'],
                'description' => $value['description'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]);
        }

        foreach ($dusuns as $value) {
            RraDusun::create([
                'rra_no' => $rra->rra_no,
                'dusun_name' => $value['dusun_name'],
                'potential' => $value['potential'],
                'land_area' => $value['land_area'],
                'accessibility' => $value['accessibility'],
                'dry_land_area' => $value['dry_land_area'],
                'pic_dusun' => $value['pic_dusun'],
                'position' => $value['position'],
                'phone' => $value['phone'],
                'whatsapp' => $value['whatsapp'],
                'total_rw' => $value['total_rw'],
                'total_rt' => $value['total_rt'],
                'total_male' => $value['total_male'],
                'total_female' => $value['total_female'],
                'total_kk' => $value['total_kk'],
                'total_farmer_family' => $value['total_farmer_family'],
                'average_family_member' => $value['average_family_member'],
                'average_farmer_family_member' => $value['average_farmer_family_member'],
                'education_elementary_junior_hs' => $value['education_elementary_junior_hs'],
                'education_senior_hs' => $value['education_senior_hs'],
                'education_college' => $value['education_college'],
                'age_productive' => $value['age_productive'],
                'age_non_productive' => $value['age_non_productive'],
                'job_farmer' => $value['job_farmer'],
                'job_farm_workers' => $value['job_farm_workers'],
                'job_private_employee' => $value['job_private_employee'],
                'job_state_employee' => $value['job_state_employee'],
                'job_enterpreneur' => $value['job_enterpreneur'],
                'job_others' => $value['job_others'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
                'dusun_access_photo' => $value['dusun_access_photo'],
                'data_land_area_source' => $value['data_land_area_source'],
                'data_dry_land_area_source' => $value['data_dry_land_area_source'],
                'has_detail_kk' => $value['has_detail_kk'],
                'total_non_farmer_family' => $value['total_non_farmer_family'],
                'has_avg_member' => $value['has_avg_member'],
                'has_detail_avg_member' => $value['has_detail_avg_member'],
                'average_non_farmer_family_member' => $value['average_non_farmer_family_member'],
                'data_productive_source' => $value['data_productive_source'],
                'data_job_source' => $value['data_job_source'],
                'job_farmer_switcher' => $value['job_farmer_switcher'],
                'job_farm_workers_switcher' => $value['job_farm_workers_switcher'],
                'job_private_employee_switcher' => $value['job_private_employee_switcher'],
                'job_state_employee_switcher' => $value['job_state_employee_switcher'],
                'job_enterpreneur_switcher' => $value['job_enterpreneur_switcher'],
                'job_others_switcher' => $value['job_others_switcher']
            ]);
        }

        $pra = Pra::where('form_no', '=', $request->form_no)->first();

        if ($pra) {
            $pra_main = Pra::where('form_no', '=', $request->form_no)->update([
                'land_ownership_description' => $request->land_ownership_description,
                'collection_type' => $request->collection_type,
                'distribution_of_critical_land_locations_description' => $request->distribution_of_critical_land_locations_description,
                'man_min_income' => $request->man_min_income,
                'man_max_income' => $request->man_max_income,
                'man_income_source' => $request->man_income_source,
                'man_commodity_name' => $request->man_commodity_name,
                'man_method' => $request->man_method,
                'man_average_capacity' => $request->man_average_capacity,
                'man_marketing' => $request->man_marketing,
                'man_period' => $request->man_period,
                'man_source' => $request->man_source,
                'woman_min_income' => $request->woman_min_income,
                'woman_max_income' => $request->woman_max_income,
                'woman_income_source' => $request->woman_income_source,
                'woman_commodity_name' => $request->woman_commodity_name,
                'woman_method' => $request->woman_method,
                'woman_average_capacity' => $request->woman_average_capacity,
                'woman_marketing' => $request->woman_marketing,
                'woman_period' => $request->woman_period,
                'woman_source' => $request->woman_source,
                'income_description' => $request->income_description,
                'land_utilization_source' => $request->land_utilization_source,
                'land_utilization_plant_type' => $request->land_utilization_plant_type ? implode(',', $request->land_utilization_plant_type) : '',
                'land_utilization_description' => $request->land_utilization_description,
                'pra_watersource_description' => $request->pra_watersource_description,
                'complete_data' => '0',
                'is_dell' => '0',
                'updated_at' => Carbon::now(),
                'dry_land_photo' => $request->dry_land_photo,
                'dry_land_photo2' => $request->dry_land_photo2,
                'watersource_photo' => $request->watersource_photo,
                'status' => $request->status
            ]);
            // $pra_no = $pra_main->pra_no;
        } else {
            $pra_no = Pra::Maxno();

            $pra = Pra::create([
                'pra_no' => $pra_no,
                'form_no' => $request->form_no,
                'land_ownership_description' => $request->land_ownership_description,
                'distribution_of_critical_land_locations_description' => $request->distribution_of_critical_land_locations_description,
                'collection_type' => $request->collection_type,
                'man_min_income' => $request->man_min_income,
                'man_max_income' => $request->man_max_income,
                'man_income_source' => $request->man_income_source,
                'man_commodity_name' => $request->man_commodity_name,
                'man_method' => $request->man_method,
                'man_average_capacity' => $request->man_average_capacity,
                'man_marketing' => $request->man_marketing,
                'man_period' => $request->man_period,
                'man_source' => $request->man_source,
                'woman_min_income' => $request->woman_min_income,
                'woman_max_income' => $request->woman_max_income,
                'woman_income_source' => $request->woman_income_source,
                'woman_commodity_name' => $request->woman_commodity_name,
                'woman_method' => $request->woman_method,
                'woman_average_capacity' => $request->woman_average_capacity,
                'woman_marketing' => $request->woman_marketing,
                'woman_period' => $request->woman_period,
                'woman_source' => $request->woman_source,
                'income_description' => $request->income_description,
                'land_utilization_source' => $request->land_utilization_source,
                'land_utilization_plant_type' => $request->land_utilization_plant_type ? implode(',', $request->land_utilization_plant_type) : '',
                'land_utilization_description' => $request->land_utilization_description,
                'pra_watersource_description' => $request->pra_watersource_description,
                'complete_data' => '0',
                'is_dell' => '0',
                'user_id' => $request->user_id ?? Auth::user()->email ?? '-',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
                'dry_land_photo' => $request->dry_land_photo,
                'dry_land_photo2' => $request->dry_land_photo2,
                'watersource_photo' => $request->watersource_photo,
                'status' => $request->status
            ]);
        }

        PraDisasterDetail::where('pra_no', '=', $pra->pra_no)->delete();
        PraFertilizerDetail::where('pra_no', '=', $pra->pra_no)->delete();
        PraPesticideDetail::where('pra_no', '=', $pra->pra_no)->delete();
        PraDryLandSpread::where('pra_no', '=', $pra->pra_no)->delete();
        PraLandOwnership::where('pra_no', '=', $pra->pra_no)->delete();
        PraWatersourceDetail::where('pra_no', '=', $pra->pra_no)->delete();
        PraExistingProblem::where('pra_no', '=', $pra->pra_no)->delete();
        PraFarmerIncome::where('pra_no', '=', $pra->pra_no)->delete();
        SocialimpactFaunaDetail::where('pra_no', '=', $pra->pra_no)->delete();
        SocialimpactFloraDetail::where('pra_no', '=', $pra->pra_no)->delete();

        $pra_disaster = $request->disaster_history;
        $pra_fertilizer = $request->pra_fertilizer;
        $pra_pesticide = $request->pra_pesticide;
        $dry_land = $request->distribution_of_critical_land_locations;
        $land_ownership = $request->land_ownership;
        $pra_watersource = $request->pra_watersource;
        $existing_problem = $request->problem_existing;
        $farmer_income = $request->farmer_income;
        $sosfauna = $request->fauna_data;
        $sosflora = $request->flora_data;

        foreach ($pra_disaster as $value) {
            PraDisasterDetail::create([
                'pra_no' => $pra->pra_no,
                'disaster_name' => $value['disaster_name'],
                'disaster_categories' => $value['disaster_categories'],
                'year' => $value['year'],
                'fatalities' => $value['fatalities'],
                'has_fatalities' => $value['has_fatalities'],
                'detail' => $value['detail'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]);
        }

        foreach ($pra_fertilizer as $value) {
            PraFertilizerDetail::create([
                'pra_no' => $pra->pra_no,
                'fertilizer_categories' => $value['fertilizer_categories'],
                'fertilizer_type' => $value['fertilizer_type'],
                'fertilizer_name' => $value['fertilizer_name'],
                'fertilizer_source' => $value['fertilizer_source'],
                'fertilizer_description' => $value['fertilizer_description'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]);
        }

        foreach ($pra_pesticide as $value) {
            PraPesticideDetail::create([
                'pra_no' => $pra->pra_no,
                'pesticide_categories' => $value['pesticide_categories'],
                'pesticide_type' => $value['pesticide_type'],
                'pesticide_name' => $value['pesticide_name'],
                'pesticide_source' => $value['pesticide_source'],
                'pesticide_description' => $value['pesticide_description'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]);
        }

        foreach ($dry_land as $value) {
            PraDryLandSpread::create([
                'pra_no' => $pra->pra_no,
                'dusun_name' => $value['dusun_name'],
                'type_utilization' => $value['type_utilization'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]);
        }

        foreach ($land_ownership as $value) {
            PraLandOwnership::create([
                'pra_no' => $pra->pra_no,
                'type_ownership' => $value['type_ownership'],
                'land_ownership' => $value['land_ownership'],
                'percentage' => $value['percentage'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]);
        }

        foreach ($pra_watersource as $value) {
            PraWatersourceDetail::create([
                'pra_no' => $pra->pra_no,
                'watersource_name' => $value['watersource_name'],
                'watersource_type' => $value['watersource_type'],
                'watersource_condition' => $value['watersource_condition'],
                'consumption' => $value['consumption'],
                'watersource_utilization' => $value['watersource_utilization'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]);
        }

        foreach ($existing_problem as $value) {
            PraExistingProblem::create([
                'pra_no' => $pra->pra_no,
                'problem_categories' => $value['problem_categories'],
                'problem_name' => $value['problem_name'],
                'problem_source' => $value['problem_source'],
                'problem_solution' => $value['problem_solution'],
                'date' => $value['date'],
                'impact_to_people' => $value['impact_to_people'],
                'interval_problem' => $value['interval_problem'],
                'priority' => $value['priority'],
                'potential' => $value['potential'],
                'total_value' => $value['total_value'],
                'ranking' => $value['ranking'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]);
        }

        foreach ($farmer_income as $value) {
            PraFarmerIncome::create([
                'pra_no' => $pra->pra_no,
                'name' => $value['name'],
                'gender' => $value['gender'],
                'source' => $value['source'],
                'source_income' => $value['source_income'],
                'capacity' => $value['capacity'],
                'commodity_name' => $value['commodity_name'],
                'family_member' => $value['family_member'],
                'family_type' => $value['family_type'],
                'indirect_method' => $value['indirect_method'],
                'job' => $value['job'],
                'method' => $value['method'],
                'period' => $value['period'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]);
        }

        foreach ($sosfauna as $value) {
            SocialimpactFaunaDetail::create([
                'pra_no' => $pra->pra_no,
                'fauna_categories' => $value['fauna_categories'],
                'fauna_name' => $value['fauna_name'],
                'fauna_population' => $value['fauna_population'],
                'fauna_foodsource' => $value['fauna_foodsource'],
                'fauna_status' => $value['fauna_status'],
                'fauna_habitat' => $value['fauna_habitat'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]);
        }

        foreach ($sosflora as $value) {
            SocialimpactFloraDetail::create([
                'pra_no' => $pra->pra_no,
                'flora_categories' => $value['flora_categories'],
                'flora_name' => $value['flora_name'],
                'flora_population' => $value['flora_population'],
                'flora_foodsource' => $value['flora_foodsource'],
                'flora_status' => $value['flora_status'],
                'flora_habitat' => $value['flora_habitat'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]);
        }

        // $logData = [
        //     'status' => 'Created Scooping',
        //     'data_no' => $data_no
        // ];
        // $this->createLog($logData);

        $rslt = $this->ResultReturn(200, 'success', 'success');
        return response()->json($rslt, 200);
    }

    public function VerificationRraPra(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'form_no' => 'required',
        ]);

        if ($validator->fails()) {
            $rslt = $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        }

        $form_data_no = $request->form_no;
        $scooping = DB::table('rras')->where('form_no', '=', $form_data_no)->first();

        if ($scooping) {
            Rra::where('form_no', '=', $form_data_no)
                ->update([
                    'verified_at' => Carbon::now(),
                    'verified_by' => Auth::user()->email,
                    'is_verify' => 1,
                    'status' => 'submit_review'
                ]);

            Pra::where('form_no', '=', $form_data_no)
                ->update([
                    'verified_at' => Carbon::now(),
                    'verified_by' => Auth::user()->email,
                    'is_verify' => 1,
                    'status' => 'submit_review'
                ]);

            Desa::where('kode_desa', '=', $scooping->village)
                ->update([
                    'status' => 1,
                    'updated_at' => Carbon::now(),
                ]);

            // $this->createLogs([
            //     'status'=>'Verified Social Officer',
            //     'organic_no'=>$form_data_no
            // ]);

            $rslt = $this->ResultReturn(200, 'success', 'success');
            return response()->json($rslt, 200);
        } else {
            $rslt = $this->ResultReturn(400, 'doesnt match data', 'doesnt match data');
            return response()->json($rslt, 400);
        }
    }

    public function VerificationRraPraDev(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'form_no' => 'required',
        ]);

        if ($validator->fails()) {
            $rslt = $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        }

        $form_data_no = $request->form_no;
        $scooping = DB::table('rras')->where('form_no', '=', $form_data_no)->first();

        if ($scooping) {
            Rra::where('form_no', '=', $form_data_no)
                ->update([
                    'verified_at' => Carbon::now(),
                    'verified_by' => Auth::user()->email,
                    'is_verify' => 1,
                    'status' => 'submit_review'
                ]);

            Pra::where('form_no', '=', $form_data_no)
                ->update([
                    'verified_at' => Carbon::now(),
                    'verified_by' => Auth::user()->email,
                    'is_verify' => 1,
                    'status' => 'submit_review'
                ]);

            Desa::where('kode_desa', '=', $scooping->village)
                ->update([
                    'status' => 1,
                    'updated_at' => Carbon::now(),
                ]);

            // $this->createLogs([
            //     'status'=>'Verified Social Officer',
            //     'organic_no'=>$form_data_no
            // ]);

            $rslt = $this->ResultReturn(200, 'success', 'success');
            return response()->json($rslt, 200);
        } else {
            $rslt = $this->ResultReturn(400, 'doesnt match data', 'doesnt match data');
            return response()->json($rslt, 400);
        }
    }

    public function VerificationPMRraPra(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'form_no' => 'required',
        ]);

        if ($validator->fails()) {
            $rslt = $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        }

        $form_data_no = $request->form_no;
        $scooping = DB::table('rras')->where('form_no', '=', $form_data_no)->first();

        if ($scooping) {
            Rra::where('form_no', '=', $form_data_no)
                ->update([
                    'verified_at' => Carbon::now(),
                    'verified_by' => Auth::user()->email,
                    'is_verify' => 2
                ]);

            Pra::where('form_no', '=', $form_data_no)
                ->update([
                    'verified_at' => Carbon::now(),
                    'verified_by' => Auth::user()->email,
                    'is_verify' => 2
                ]);

            // $this->createLogs([
            //     'status'=>'Verified Social Officer',
            //     'organic_no'=>$form_data_no
            // ]);

            $rslt = $this->ResultReturn(200, 'success', 'success');
            return response()->json($rslt, 200);
        } else {
            $rslt = $this->ResultReturn(400, 'doesnt match data', 'doesnt match data');
            return response()->json($rslt, 400);
        }
    }

    public function UnverificationRraPra(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'form_no' => 'required',
        ]);

        if ($validator->fails()) {
            $rslt = $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        }

        $form_data_no = $request->form_no;
        $scooping = DB::table('rras')->where('form_no', '=', $form_data_no)->first();

        if ($scooping) {
            Rra::where('form_no', '=', $form_data_no)
                ->update([
                    'verified_at' => Carbon::now(),
                    'verified_by' => '-',
                    'is_verify' => 0,
                    'status' => 'ready_to_submit'
                ]);

            Pra::where('form_no', '=', $form_data_no)
                ->update([
                    'verified_at' => Carbon::now(),
                    'verified_by' => '-',
                    'is_verify' => 0,
                    'status' => 'ready_to_submit'
                ]);

            Desa::where('kode_desa', '=', $scooping->village)
                ->update([
                    'status' => 0,
                    'updated_at' => Carbon::now(),
                ]);

            // $this->createLogs([
            //     'status'=>'Verified Social Officer',
            //     'organic_no'=>$form_data_no
            // ]);

            $rslt = $this->ResultReturn(200, 'success', 'success');
            return response()->json($rslt, 200);
        } else {
            $rslt = $this->ResultReturn(400, 'doesnt match data', 'doesnt match data');
            return response()->json($rslt, 400);
        }
    }

    public function ReportScooping(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'data_no' => 'required',
        ]);

        if ($validator->fails()) {
            $rslt = $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        }

        $gis_data_no = $request->data_no;

        $GetScoopingDetail = DB::table('scooping_visits')
            ->select(
                'scooping_visits.*',
                'scooping_visits.altitude as land_height',
                'scooping_visits.slope as land_slope',
                'scooping_visits.goverment_place as government_place',
                'provinces.name as province_name',
                'kabupatens.name as city_name',
                'kecamatans.name as district_name',
                'desas.name as village_name'

            )
            ->join('provinces', 'provinces.province_code', 'scooping_visits.province')
            ->join('kabupatens', 'kabupatens.kabupaten_no', 'scooping_visits.city')
            ->join('kecamatans', 'kecamatans.kode_kecamatan', 'scooping_visits.district')
            ->join('desas', 'desas.kode_desa', 'scooping_visits.village')
            ->where('scooping_visits.data_no', '=', $gis_data_no)
            ->first();

        $GetScoopingDetail->scooping_figures = DB::table('scooping_visit_figures')
            ->select('scooping_visit_figures.*')
            ->where('data_no', '=', $gis_data_no)->get();

        $rslt = $this->ResultReturn(200, 'success', $GetScoopingDetail);
        return response()->json($rslt, 200);
    }

    public function ReportRra(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'rra_no' => 'required',
        ]);

        if ($validator->fails()) {
            $rslt = $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        }

        $rra_no = $request->rra_no;

        $GetRraDetail = DB::table('rras')
            ->select('rras.*')
            ->where('rra_no', '=', $rra_no)
            ->first();

        $GetRraDetail->community_institution = DB::table('rra_community_institutions')
            ->select('rra_community_institutions.*')
            ->where('rra_no', '=', $rra_no)->get();

        $GetRraDetail->rra_dusuns = DB::table('rra_dusuns')
            ->select('rra_dusuns.*')
            ->where('rra_no', '=', $rra_no)->get();

        $GetRraDetail->existing_plants = DB::table('rra_existing_plants')
            ->select('rra_existing_plants.*')
            ->where('rra_no', '=', $rra_no)->get();

        $GetRraDetail->village_border = DB::table('village_borders')
            ->select(
                'village_borders.*',
                'kabupatens.name as city_name',
                'kecamatans.name as district_name',
                'desas.name as village_name'
            )
            ->join('kabupatens', 'kabupatens.kabupaten_no', 'village_borders.kabupaten_no')
            ->join('kecamatans', 'kecamatans.kode_kecamatan', 'village_borders.kode_kecamatan')
            ->join('desas', 'desas.kode_desa', 'village_borders.kode_desa')
            ->where('rra_no', '=', $rra_no)->get();

        $GetRraDetail->land_use_patterns = DB::table('rra_land_uses')
            ->select('rra_land_uses.*')
            ->where('rra_no', '=', $rra_no)->get();

        $GetRraDetail->organic_farming_potential = DB::table('rra_organic_potentials')
            ->select('rra_organic_potentials.*')
            ->where('rra_no', '=', $rra_no)->get();

        $GetRraDetail->production_marketing = DB::table('rra_production_marketings')
            ->select('rra_production_marketings.*')
            ->where('rra_no', '=', $rra_no)->get();

        $GetRraDetail->identification_of_innovative_farmers = DB::table('rra_innovative_farmers')
            ->select('rra_innovative_farmers.*')
            ->where('rra_no', '=', $rra_no)->get();

        $rslt = $this->ResultReturn(200, 'success', $GetRraDetail);
        return response()->json($rslt, 200);
    }

    public function ReportPra(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'pra_no' => 'required',
        ]);

        if ($validator->fails()) {
            $rslt = $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        }

        $pra_no = $request->pra_no;

        $GetPraDetail = DB::table('pras')
            ->select('pras.*')
            ->where('pra_no', '=', $pra_no)
            ->first();

        $GetPraDetail->DisasterHistory = DB::table('pra_disaster_details')
            ->select('pra_disaster_details.*')
            ->where('pra_no', '=', $GetPraDetail->pra_no)->get();

        $GetPraDetail->ExistingProblem = DB::table('pra_existing_problems')
            ->select('pra_existing_problems.*')
            ->where('pra_no', '=', $GetPraDetail->pra_no)->get();

        $GetPraDetail->FarmerIncome = DB::table('pra_farmer_incomes')
            ->select('pra_farmer_incomes.*')
            ->where('pra_no', '=', $GetPraDetail->pra_no)->get();

        $GetPraDetail->Fertilizer = DB::table('pra_fertilizer_details')
            ->select('pra_fertilizer_details.*')
            ->where('pra_no', '=', $GetPraDetail->pra_no)->get();

        $GetPraDetail->Pesticide = DB::table('pra_pesticide_details')
            ->select('pra_pesticide_details.*')
            ->where('pra_no', '=', $GetPraDetail->pra_no)->get();

        $GetPraDetail->Watersource = DB::table('pra_watersource_details')
            ->select('pra_watersource_details.*')
            ->where('pra_no', '=', $GetPraDetail->pra_no)->get();

        $GetPraDetail->LandOwnership = DB::table('pra_land_ownerships')
            ->select('pra_land_ownerships.*')
            ->where('pra_no', '=', $GetPraDetail->pra_no)->get();

        $rslt = $this->ResultReturn(200, 'success', $GetPraDetail);
        return response()->json($rslt, 200);
    }

    public function createLog($logData)
    {
        // get main data
        $main = DB::table('scooping_visits')->where('data_no', $logData['data_no'])->first();

        //get desa

    }
}