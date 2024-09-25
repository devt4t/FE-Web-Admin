<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use DB;
use Carbon\Carbon;
use App\User;
use App\Desa;
use App\Farmer;
use App\FieldFacilitator;
use App\Employee;
use App\Kecamatan;
use App\Kabupaten;
use App\Province;
use App\Lahan;
use App\LogLahan;
use App\LahanTutupan;
use App\LahanDetail;
use App\MainPivot;
use App\Tree;
use App\TreeLocation;
use App\LahanProject;
use App\LahanPolygon;
use App\LahanFFDevice;

class LahanController extends Controller
{
    // NEW GEKO
    public function GetLahanByLahan_no_new(Request $request){
        $detail_id = $request->lahan_no;
            $req = $request->all();
            
            $field = ['*'];
            $main_query =  $this->DynamicDetail([
                'sourceColumn' => 'lahan_no',
                'id_type' => 'string',
                'detail_id' => $detail_id,
                'tableName' => 'lahans',
                'tableAlias' => 'A',
                'field' => $field,
                'req' => $req
            ]);
            
            
            $main_details = DB::selectOne($main_query);
            
            
            return response()->json([
                    'main_lahan' => $main_details,
                ], 200);
    }
    
    public function GetLahanAll_new(Request $request){
        $validator = Validator::make($request->all(), [
                // 'program_year' => 'required'
            ]);
        if($validator->fails()){
            $rslt =  $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        }else{
            $program_year = $request->program_year ?? '2024';
            $employeeUser = $this->getFFListByUserPY($program_year);
            
            $req = $request->all();
            $searchValue = $request->search_value;
            $searchable = ['A.lahan_no', 'G.name', 'H.name', 'B.name', 'C.name'];
            $filterable = [
                'farmer_no' => [
                        'request_value' => $request->farmer_no,
                        'table_alias' => 'A',
                        'operator' => '='
                    ],
                'village' => [
                        'request_value' => $request->kode_desa,
                        'table_alias' => 'A',
                        'operator' => '='
                    ],
                'target_area' => [
                        'request_value' => $request->area_code,
                        'table_alias' => 'A',
                        'operator' => '='
                    ],
                'mu_no' => [
                        'request_value' => $request->mu_no,
                        'table_alias' => 'A',
                        'operator' => '='
                    ],
                'approve' => [
                        'request_value' => $request->approve,
                        'table_alias' => 'A',
                        'operator' => '='
                    ],
                'fc_complete_data' => [
                        'request_value' => $request->complete_data_fc,
                        'table_alias' => 'A',
                        'operator' => '='
                    ], 
                'updated_gis' => [
                        'request_value' => $request->updated_gis,
                        'table_alias' => 'A',
                        'operator' => '='
                    ], 
                ];
    
            $sortable = ['id', 'lahan_no', 'created_time'];
            $tableName = "lahans";
            $tableAlias = "A";
            
            $limit = isset($req['limit']) ? $req['limit'] : 10;
            $offset = isset($req['offset']) ? $req['offset'] : 0;
            $field = ['*'];
                

                
            $relation = [
                "village" => [
                    "reference_table" => "desas",
                    "table_alias" => "B",
                    "reference_column" => "kode_desa",
                    "display" => ['kode_desa', 'name'],
                    ],
                "user_id" => [
                    "reference_table" => "field_facilitators",
                    "table_alias" => "C",
                    "reference_column" => "ff_no",
                    "display" => ['id', 'name'],
                    ],
                "kecamatan" => [
                    "reference_table" => "kecamatans",
                    "table_alias" => "E",
                    "reference_column" => "kode_kecamatan",
                    "display" => ['name'],
                    ],
                "city" => [
                    "reference_table" => "kabupatens",
                    "table_alias" => "F",
                    "reference_column" => "kabupaten_no",
                    "display" => ['name'],
                    ],
                "mu_no" => [
                    "reference_table" => "managementunits",
                    "table_alias" => "G",
                    "reference_column" => "mu_no",
                    "display" => ['name']
                    ],
                "target_area" => [
                    "reference_table" => "target_areas",
                    "table_alias" => "H",
                    "reference_column" => "area_code",
                    "display" => ['name'],
                    ],
                "lahan_no" => [
                    "reference_table" => "main_pivots",
                    "table_alias" => "I",
                    "reference_column" => "key2",
                    "display" => [],
                    "custom_alias" => "pivot",
                    // "origin_table" => "D"
                    ],
            ];
            $custom_relation = [
                "farmers_joinment" => [
                    "join" => " LEFT JOIN farmers as D ON D.farmer_no = A.farmer_no ",
                    "display" => 'D.name as farmer_name',
                    ],
                // "lahan_project" => [
                //     "join" => " LEFT JOIN lahan_projects as J ON J.lahan_no = A.lahan_no ",
                //     "display" => 'J.project_no as lahan_project_no',
                //     ],
                // "projects" => [
                //     "join" => " LEFT JOIN projects as K ON K.project_no = J.project_no ",
                //     "display" => 'K.project_no, K.project_name',
                //     ],
                // "project_purpose" => [
                //     "join" => " LEFT JOIN project_planting_purposes as L ON L.id = K.project_planting_purpose_id ",
                //     "display" => 'L.id as project_purpose_id, L.name as project_purpose_name',
                //     ],
            ];
            $condition = [
                "type"=> [
                    "conditional_table" => "main_pivots",
                    "conditional_table_alias" => "I",
                    "conditional_column" => "type",
                    "conditional_param" => "=",
                    "conditional_value" => "'farmer_lahan'",
                    ],
                "program_year"=> [
                    "conditional_table" => "main_pivots",
                    "conditional_table_alias" => "I",
                    "conditional_column" => "program_year",
                    "conditional_param" => "LIKE",
                    "conditional_value" => "'%$program_year%'",
                    ],
                ];
            $user_id = [
                "user_id" => [
                    "listId" => $employeeUser
                    ],
                ];
            // return response()->json($relation, 200);
    
            $query =  $this->DynamicList([
                        'tableName' => $tableName,
                        'tableAlias' => $tableAlias,
                        'limit' => $limit,
                        'offset' => $offset,
                        'field' => $field,
                        'sortable' => $sortable,
                        'filterable' => $filterable,
                        'relation' => $relation,
                        'custom_relation' => $custom_relation,
                        'searchable' => $searchable,
                        'search' => $searchValue,
                        'condition' => $condition,
                        'req' => $req,
                        'users_id' => $user_id
                    ]);
                    
            
            $custom_counter = [
                "'1'" => [
                    "table_alias" => 'A',
                    "indicator_column" => 'fc_complete_data',
                    "operator" => '=',
                    "value_alias" => "'fc_complete_datas'"
                    ],
                "'sudah'" => [
                    "table_alias" => 'A',
                    "indicator_column" => 'updated_gis',
                    "operator" => '=',
                    "value_alias" => "'updated_gis'"
                    ],
                "fc_verif" => [
                    "table_alias" => 'A',
                    "indicator_column" => 'approve',
                    "operator" => '=',
                    "value_alias" => "'fc_verif'",
                    "custom_key" => "'1'"
                    ],
                "um_verif" => [
                    "table_alias" => 'A',
                    "indicator_column" => 'approve',
                    "operator" => '=',
                    "value_alias" => "'um_verif'",
                    "custom_key" => "'2'"
                    ],
                ];
                
            $customStatistic = $this->DynamicCount([
                    'tableName' => $tableName,
                    'indicator_column' => '',
                    'relation' => $relation, 
                    'users_id' => $user_id,
                    'condition' => $condition,
                    'filterable' => $filterable,
                    
                    'custom_counter' => $custom_counter,
                ]);
                
            
            $result = DB::select($query['sql']);
            
            $projectRelation = [
                    "project_no" => [
                        "reference_table" => "projects",
                        "table_alias" => "B",
                        "reference_column" => "project_no",
                        "display" => ['project_name']
                        ],
                    "project_planting_purpose_id" => [
                        "reference_table" => "project_planting_purposes",
                        "table_alias" => "C",
                        "reference_column" => "id",
                        "display" => ['code', 'name'],
                        "origin_table" => "B"
                        ],
                    "project_planting_type_id" => [
                        "reference_table" => "project_types",
                        "table_alias" => "D",
                        "reference_column" => "id",
                        "display" => ['code', 'name'],
                        "origin_table" => "B"
                        ],
                    "project_planting_environment_id" => [
                        "reference_table" => "project_planting_environments",
                        "table_alias" => "E",
                        "reference_column" => "id",
                        "display" => ['code', 'name'],
                        "origin_table" => "B"
                        ],
                ];
                $treesRelation = [
                    "tree_code" => [
                        "reference_table" => "trees",
                        "table_alias" => "B",
                        "reference_column" => "tree_code",
                        "display" => ['tree_name', 'scientific_name', 'english_name', 'tree_category']
                        ],
                ];
                $projectDataCondition = [
                    "program_year" => [
                        "conditional_table" => "lahan_projects",
                        "conditional_table_alias" => "A",
                        "conditional_column" => "program_year",
                        "conditional_param" => "LIKE",
                        "conditional_value" => "'%$program_year%'",
                        ],
                ];
            foreach($result as $data){
                $detailResult = "SELECT SUM(CASE WHEN B.tree_category = 'Pohon_Kayu' THEN A.amount ELSE 0 END) AS pohon_kayu_detail, SUM(CASE WHEN B.tree_category = 'Pohon_Buah' THEN A.amount ELSE 0 END) AS pohon_mpts_detail, SUM(CASE WHEN B.tree_category = 'Tanaman_Bawah_Empon' THEN A.amount ELSE 0 END) AS tanaman_bawah_detail, SUM(CASE WHEN B.tree_category = 'Mangrove' THEN A.amount ELSE 0 END) AS pohon_mangrove_detail FROM `lahan_details` A LEFT JOIN trees B ON B.tree_code = A.tree_code  WHERE A.lahan_no = '". $data->lahan_no ."' AND YEAR(A.detail_year) = '". $program_year."'";
                $data->total_from_detail = DB::select($detailResult);
                
                $lahan_project_query = $this->DynamicDetail([
                    'sourceColumn' => 'lahan_no',
                    'id_type' => 'string',
                    'detail_id' => $data->lahan_no,
                    'tableName' => 'lahan_projects',
                    'relation' => $projectRelation,
                    'condition' => $projectDataCondition,
                    'tableAlias' => 'A',
                    'field' => $field,
                    'req' => $req
                ]);
                $data->land_project = DB::selectOne($lahan_project_query);
                
                $log_condition = [
                    "program_year"=> [
                        "conditional_table" => "log_lahans",
                        "conditional_table_alias" => "A",
                        "conditional_column" => "program_year",
                        "conditional_param" => "LIKE",
                        "conditional_value" => "'%$program_year%'",
                        ],
                    ];
                
                $log_lahans = $this->DynamicDetail([
                    'sourceColumn' => 'lahan_no',
                    'id_type' => 'string',
                    'detail_id' => $data->lahan_no,
                    'tableName' => 'log_lahans',
                    'relation' => $relation, 
                    'condition' => $log_condition,
                    'tableAlias' => 'A',
                    'field' => ["*"],
                    'req' => $request
                ]);
                $data->log_lahans = DB::select($log_lahans);
            }
            
            $result_record = DB::select($query['sql_record']);
            
            $cust_stat = DB::select($customStatistic); 
            foreach($cust_stat as $stat){
                $unapproveSql = "SELECT COUNT(*) as datas FROM lahans WHERE approve = 0 AND fc_complete_data = 1";
                $stat->unverified = DB::select($unapproveSql)[0]->datas;
                // $stat->unverified = $stat_res;
            }
            // if(isset($request->project_filter)){
            //     $project = $request->project_filter;
            //     $getList_project = DB::table('projects')->select('project_no')->get()->toArray();
            //     $project_strArr = array_column($getList_project, 'project_no');
            //     $frontProject_list = $project_strArr;
            //     if(($key = array_search($project, $frontProject_list)) !== false){
            //         unset($frontProject_list[$key]);
            //         $frProject_list = [];
            //         foreach($frontProject_list as $key){
            //             array_push($frProject_list,$key);
            //         }
            //     }
            //     foreach($result as $res){
            //         $project_no = $res->land_project->project_no;
            //         if(!in_array($project_no, $frontProject_list)){
            //             $res->projects_no = $res->land_project->project_no;
            //         }
                    
            //     }
                
            // }
            
            return response()->json([
                    'data' => $result,
                    'custom_count' => $cust_stat[0],
                    // 'sql' => $query['sql'],
                    'project_filter_dev' => $frProject_list ?? 'test',
                    'total' => $result_record[0]->total,
                    
                ], 200);
            
            // return response()->json($employeeUser, 200);
        }
    }
    
    public function getDetailLahan_new(Request $request){
        $detail_id = $request->id;
            $req = $request->all();
            
            $field = ['*'];
            $lahan_no = DB::table('lahans')->where(['id' => $detail_id])->pluck('lahan_no')->implode('');
            
            $mainRelation = [
                "village" => [
                    "reference_table" => "desas",
                    "table_alias" => "B",
                    "reference_column" => "kode_desa",
                    "display" => ['kode_desa', 'name'],
                    ],
                "user_id" => [
                    "reference_table" => "field_facilitators",
                    "table_alias" => "C",
                    "reference_column" => "ff_no",
                    "display" => ['id', 'name'],
                    ],
                "kecamatan" => [
                    "reference_table" => "kecamatans",
                    "table_alias" => "D",
                    "reference_column" => "kode_kecamatan",
                    "display" => ['name'],
                    ],
                "city" => [
                    "reference_table" => "kabupatens",
                    "table_alias" => "E",
                    "reference_column" => "kabupaten_no",
                    "display" => ['name'],
                    ],
                "mu_no" => [
                    "reference_table" => "managementunits",
                    "table_alias" => "F",
                    "reference_column" => "mu_no",
                    "display" => ['name']
                    ],
                "target_area" => [
                    "reference_table" => "target_areas",
                    "table_alias" => "G",
                    "reference_column" => "area_code",
                    "display" => ['name'],
                    ],
                "farmer_no" => [
                    "reference_table" => "farmers",
                    "table_alias" => "H",
                    "reference_column" => "farmer_no",
                    "display" => ['name'],
                    ],
                "lahan_no" => [
                    "reference_table" => "main_pivots",
                    "table_alias" => "K",
                    "reference_column" => "key2",
                    "display" => [],
                    ],
                "key1" => [
                    "reference_table" => "farmers",
                    "table_alias" => "L",
                    "reference_column" => "farmer_no",
                    "display" => ['name', 'ktp_no', 'ktp_document', 'address', 'farmer_profile', "post_code", "mou_no", "legal_land_categories"],
                    "custom_alias" => "pivot_farmer",
                    "origin_table" => "K"
                    ],
                "province" => [
                    "reference_table" => "provinces",
                    "table_alias" => "M",
                    "reference_column" => "province_code",
                    "display" => ['name'],
                    "custom_alias" => "farmer",
                    "origin_table" => "L"
                    ],
                // "city" => [
                //     "reference_table" => "kabupatens",
                //     "table_alias" => "N",
                //     "reference_column" => "kabupaten_no",
                //     "custom_key" => "city",
                //     "display" => ['name'],
                //     "custom_alias" => "farmer",
                //     "origin_table" => "L"
                //     ],
                ];
            $customMainRelation = [
                "farmers_joinment" => [
                    "join" => " LEFT JOIN main_pivots as I ON I.key2 = H.farmer_no ",
                    "display" => 'I.key1',
                    ],
                "ff" => [
                    "join" => " LEFT JOIN users as J ON J.employee_no = I.key1 ",
                    "display" => 'J.email as users_email',
                    ],
                "gg" => [
                    "join" => " LEFT JOIN kabupatens as N ON N.kabupaten_no = L.city ",
                    "display" => 'N.name as kabupaten_name_farmer',
                    ],
                "hh" => [
                    "join" => " LEFT JOIN kecamatans as O ON O.kode_kecamatan = L.kecamatan ",
                    "display" => 'O.name as kecamatan_name_farmer',
                    ],
                "ii" => [
                    "join" => " LEFT JOIN desas as P ON P.kode_desa = L.village ",
                    "display" => 'P.name as desa_name_farmer',
                    ],
            ];
            $brokenBarcodeRelation = [
                "farmer_no" => [
                    "reference_table" => "farmers",
                    "table_alias" => "B",
                    "reference_column" => "farmer_no",
                    "display" => ['name'],
                    ],
                "user_id" => [
                    "reference_table" => "field_facilitators",
                    "table_alias" => "C",
                    "reference_column" => "ff_no",
                    "display" => ['id', 'name'],
                    ],
                "mu_no" => [
                    "reference_table" => "managementunits",
                    "table_alias" => "D",
                    "reference_column" => "mu_no",
                    "display" => ['name']
                    ],
                "target_area" => [
                    "reference_table" => "target_areas",
                    "table_alias" => "E",
                    "reference_column" => "area_code",
                    "display" => ['name'],
                    ],
                "village" => [
                    "reference_table" => "desas",
                    "table_alias" => "F",
                    "reference_column" => "kode_desa",
                    "display" => ['kode_desa', 'name'],
                    ],
                "verified_by" => [
                    "reference_table" => "employees",
                    "table_alias" => "G",
                    "reference_column" => "nik",
                    "display" => ['email', 'name'],
                    ]
            ];
            $detailRelation = [
                    "tree_code" => [
                        "reference_table" => "trees",
                        "table_alias" => "B",
                        "reference_column" => "tree_code",
                        "display" => ['tree_name', 'scientific_name']
                        ],
                    "user_id" => [
                        "reference_table" => "field_facilitators",
                        "table_alias" => "C",
                        "reference_column" => "ff_no",
                        "display" => ['id', 'name'],
                        ],
                ];
            $projectRelation = [
                    "project_no" => [
                        "reference_table" => "projects",
                        "table_alias" => "B",
                        "reference_column" => "project_no",
                        "display" => ['project_name']
                        ],
                    "project_planting_purpose_id" => [
                        "reference_table" => "project_planting_purposes",
                        "table_alias" => "C",
                        "reference_column" => "id",
                        "display" => ['code', 'name'],
                        "origin_table" => "B"
                        ],
                    "project_planting_type_id" => [
                        "reference_table" => "project_types",
                        "table_alias" => "D",
                        "reference_column" => "id",
                        "display" => ['code', 'name'],
                        "origin_table" => "B"
                        ],
                    "project_planting_environment_id" => [
                        "reference_table" => "project_planting_environments",
                        "table_alias" => "E",
                        "reference_column" => "id",
                        "display" => ['code', 'name'],
                        "origin_table" => "B"
                        ],
                ];
            $tutupanRequestRelation = [
                    "farmer_no" => [
                        "reference_table" => "farmers",
                        "table_alias" => "B",
                        "reference_column" => "farmer_no",
                        "display" => ['name'],
                        ],
                    "user_id" => [
                        "reference_table" => "field_facilitators",
                        "table_alias" => "C",
                        "reference_column" => "ff_no",
                        "display" => ['name'],
                        ],
                    "verified_by" => [
                        "reference_table" => "employee_positions",
                        "table_alias" => "D",
                        "reference_column" => "position_no",
                        "display" => ['name'],
                        ],
                    "mu_no" => [
                        "reference_table" => "managementunits",
                        "table_alias" => "E",
                        "reference_column" => "mu_no",
                        "display" => ['name']
                        ],
                    "target_area" => [
                        "reference_table" => "target_areas",
                        "table_alias" => "F",
                        "reference_column" => "area_code",
                        "display" => ['name'],
                        ],
                ];
            $termAnswerRelation = [
                    "term_id" => [
                        "reference_table" => "lahan_term_question",
                        "table_alias" => "B",
                        "reference_column" => "id",
                        "display" => ['question'],
                        ]
                ];

            $main_query =  $this->DynamicDetail([
                'detail_id' => $detail_id,
                'tableName' => 'lahans',
                'tableAlias' => 'A',
                'field' => $field,
                'relation' => $mainRelation,
                'custom_relation' => $customMainRelation,
                'req' => $req
            ]);
            $lahan_broken_barcode_query = $this->DynamicDetail([
                'sourceColumn' => 'lahan_no',
                'id_type' => 'string',
                'detail_id' => $lahan_no,
                'tableName' => 'lahan_barcode_requests',
                'relation' => $brokenBarcodeRelation,
                'tableAlias' => 'A',
                'field' => $field,
                'req' => $req
            ]);
            $lahan_detail_query = $this->DynamicDetail([
                'sourceColumn' => 'lahan_no',
                'id_type' => 'string',
                'detail_id' => $lahan_no,
                'tableName' => 'lahan_details',
                'relation' => $detailRelation,
                'tableAlias' => 'A',
                'field' => $field,
                'req' => $req
            ]);
            $lahan_polygons_query = $this->DynamicDetail([
                'sourceColumn' => 'lahan_no',
                'id_type' => 'string',
                'detail_id' => $lahan_no,
                'tableName' => 'lahan_polygons',
                'tableAlias' => 'A',
                'field' => $field,
                'req' => $req
            ]);
            $lahan_project_query = $this->DynamicDetail([
                'sourceColumn' => 'lahan_no',
                'id_type' => 'string',
                'detail_id' => $lahan_no,
                'tableName' => 'lahan_projects',
                'relation' => $projectRelation,
                'tableAlias' => 'A',
                'field' => $field,
                'req' => $req
            ]);
            $lahan_tutupans_query = $this->DynamicDetail([
                'sourceColumn' => 'lahan_no',
                'id_type' => 'string',
                'detail_id' => $lahan_no,
                'tableName' => 'lahan_tutupans',
                'tableAlias' => 'A',
                'field' => $field,
                'req' => $req
            ]);
            $lahan_tutupan_change_requests_query = $this->DynamicDetail([
                'sourceColumn' => 'lahan_no',
                'id_type' => 'string',
                'detail_id' => $lahan_no,
                'tableName' => 'lahan_tutupan_change_requests',
                'relation' => $tutupanRequestRelation,
                'tableAlias' => 'A',
                'field' => $field,
                'req' => $req
            ]);
            $lahan_ff_devices_query = $this->DynamicDetail([
                'sourceColumn' => 'lahan_no',
                'id_type' => 'string',
                'detail_id' => $lahan_no,
                'tableName' => 'lahan_ff_devices',
                'tableAlias' => 'A',
                'field' => $field,
                'req' => $req
            ]);
            
            $lahan_term_question_query = $this->DynamicList([
                'tableName' => 'lahan_term_question',
                'tableAlias' => 'A',
                'limit' => 20,
                'offset' => 0,
                'field' => $field,
                'relation' => [],
                'req' => $req,
            ]);
            $lahan_project_term_query = $this->DynamicDetail([
                'sourceColumn' => 'lahan_no',
                'id_type' => 'string',
                'detail_id' => $lahan_no,
                'tableName' => 'lahan_project_terms',
                'tableAlias' => 'A',
                'relation' => $termAnswerRelation,
                'field' => $field,
                'req' => $req
            ]);
            $farmer_lahan_mou_query = $this->DynamicDetail([
                'sourceColumn' => 'lahan_no',
                'id_type' => 'string',
                'detail_id' => $lahan_no,
                'tableName' => 'farmer_lahan_mou',
                'tableAlias' => 'A',
                'relation' => [],
                'field' => $field,
                'req' => $req
            ]);
            
            $main_details = DB::selectOne($main_query);
            $sumTutupans = $main_details->tutupan_pohon_percentage + $main_details->tutupan_tanaman_bawah_percentage + $main_details->tutupan_lain_bangunan_percentage;
            if($main_details->gis_polygon_area != 0){
                $land_areas = $main_details->gis_polygon_area;
            }else{
                $land_areas = $main_details->land_area;
            }
            $main_details->total_tutupan_percentage = $sumTutupans;
            $main_details->total_planting_area_after_tutupan = $land_areas - (($sumTutupans/100)*$land_areas);
            
            $lahan_broken_barcode = DB::select($lahan_broken_barcode_query);
            $lahan_details = DB::select($lahan_detail_query);
            $lahan_polygons = DB::select($lahan_polygons_query);
            $lahan_project = DB::select($lahan_project_query);
            $lahan_tutupans = DB::select($lahan_tutupans_query);
            $lahan_tutupan_change_requests = DB::select($lahan_tutupan_change_requests_query); 
            $lahan_ff_devices_request = DB::select($lahan_ff_devices_query); 
            $lahan_term_question_list = DB::select($lahan_term_question_query['sql']);
            $lahan_project_term_Request = DB::select($lahan_project_term_query);
            // $farmer_lahan_mou_Request = DB::select($farmer_lahan_mou_query); 
            
            
            return response()->json([
                    'main_lahan' => $main_details,
                    // 'main_sql' => $main_query,
                    'broken_barcode' => $lahan_broken_barcode,
                    'lahan_detail' => $lahan_details,
                    'lahan_polygon' => $lahan_polygons,
                    'lahan_project' => $lahan_project,
                    'lahan_tutupan' => $lahan_tutupans,
                    'lahan_tutupan_request' => $lahan_tutupan_change_requests,
                    'lahan_ff_devices_request' => $lahan_ff_devices_request,
                    'lahan_term_question_list' => $lahan_term_question_list,
                    'lahan_term_answer_list' => $lahan_project_term_Request,
                    // 'farmer_lahan_mou' => $farmer_lahan_mou_Request
                ], 200);
    }
    
    public function getLahanTermAnswer_new(Request $request){
        $validator = Validator::make($request->all(), [
                'lahan_no' => 'required',
                'question_id' => 'required'
            ]);
        if($validator->fails()){
            $rslt =  $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        }else{
                $req = $request->all();
                
                $field = ['*'];
                $condition = [
                "is_del" => [
                    "conditional_table" => "lahan_project_terms",
                    "conditional_table_alias" => "A",
                    "conditional_column" => "is_del",
                    "conditional_param" => "=",
                    "conditional_value" => '0',
                    ],
                "lahan_no"=> [
                    "conditional_table" => "lahan_project_terms",
                    "conditional_table_alias" => "A",
                    "conditional_column" => "lahan_no",
                    "conditional_param" => "=",
                    "conditional_value" => "'".$request->lahan_no."'",
                    ],
                "term_id"=> [
                    "conditional_table" => "lahan_project_terms",
                    "conditional_table_alias" => "A",
                    "conditional_column" => "term_id",
                    "conditional_param" => "=",
                    "conditional_value" => "'".$request->question_id."'",
                    ],
                ];
                $query =  $this->DynamicList([
                        'tableName' => 'lahan_project_terms',
                        'tableAlias' => 'A',
                        'limit' => 1,
                        'offset' => 0,
                        'field' => $field,
                        'relation' => [],
                        'condition' => $condition,
                        'req' => $req,
                    ]);
                
                
                $answer_details = DB::selectOne($query['sql']);
                
                
                return response()->json([
                        'answer_data' => $answer_details,
                    ], 200);
                
        }
    }
    
    public function getExportDataLahanFarmer_new(Request $request){
        $validator = Validator::make($request -> all(),[
            'ff_no' => 'required'
        ]);
        if($validator->fails()){
            $rslt =  $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        }else{
            $program_year = $request->program_year ?? '2024';
            $employeeUser = [$request->ff_no];
            
            $req = $request->all();
            $searchValue = $request->search_value;
            $searchable = ['A.lahan_no', 'G.name', 'H.name', 'B.name', 'C.name'];
            $filterable = [
                'farmer_no' => [
                        'request_value' => $request->farmer_no,
                        'table_alias' => 'A',
                        'operator' => '='
                    ],
                'village' => [
                        'request_value' => $request->kode_desa,
                        'table_alias' => 'A',
                        'operator' => '='
                    ],
                'target_area' => [
                        'request_value' => $request->area_code,
                        'table_alias' => 'A',
                        'operator' => '='
                    ],
                'mu_no' => [
                        'request_value' => $request->mu_no,
                        'table_alias' => 'A',
                        'operator' => '='
                    ],
                'approve' => [
                        'request_value' => $request->approve,
                        'table_alias' => 'A',
                        'operator' => '='
                    ],
                'fc_complete_data' => [
                        'request_value' => $request->complete_data_fc,
                        'table_alias' => 'A',
                        'operator' => '='
                    ], 
                ];
    
            $sortable = ['id', 'lahan_no', 'created_time'];
            $tableName = "lahans";
            $tableAlias = "A";
            
            $limit = isset($req['limit']) ? $req['limit'] : 10;
            $offset = isset($req['offset']) ? $req['offset'] : 0;
            $field = ['*'];
                

                
            $relation = [
                "village" => [
                    "reference_table" => "desas",
                    "table_alias" => "B",
                    "reference_column" => "kode_desa",
                    "display" => ['kode_desa', 'name'],
                    ],
                "user_id" => [
                    "reference_table" => "field_facilitators",
                    "table_alias" => "C",
                    "reference_column" => "ff_no",
                    "display" => ['id', 'name'],
                    ],
                "kecamatan" => [
                    "reference_table" => "kecamatans",
                    "table_alias" => "E",
                    "reference_column" => "kode_kecamatan",
                    "display" => ['name'],
                    ],
                "city" => [
                    "reference_table" => "kabupatens",
                    "table_alias" => "F",
                    "reference_column" => "kabupaten_no",
                    "display" => ['name'],
                    ],
                "mu_no" => [
                    "reference_table" => "managementunits",
                    "table_alias" => "G",
                    "reference_column" => "mu_no",
                    "display" => ['name']
                    ],
                "target_area" => [
                    "reference_table" => "target_areas",
                    "table_alias" => "H",
                    "reference_column" => "area_code",
                    "display" => ['name'],
                    ],
                "lahan_no" => [
                    "reference_table" => "main_pivots",
                    "table_alias" => "I",
                    "reference_column" => "key2",
                    "display" => [],
                    "custom_alias" => "pivot",
                    // "origin_table" => "D"
                    ],
            ];
            $custom_relation = [
                "farmers_joinment" => [
                    "join" => " LEFT JOIN farmers as D ON D.farmer_no = A.farmer_no ",
                    "display" => 'D.name as farmer_name , D.ktp_no as farmer_nik, D.approve as farmer_approval, D.legal_land_categories, D.project_model, D.ktp_document as farmer_ktp, D.farmer_profile as farmer_photo',
                ],
            ];
            $condition = [
                "is_dell" => [
                    "conditional_table" => "scooping_visits",
                    "conditional_table_alias" => "A",
                    "conditional_column" => "is_dell",
                    "conditional_param" => "=",
                    "conditional_value" => '0',
                    ],
                "type"=> [
                    "conditional_table" => "main_pivots",
                    "conditional_table_alias" => "I",
                    "conditional_column" => "type",
                    "conditional_param" => "=",
                    "conditional_value" => "'farmer_lahan'",
                    ],
                "program_year"=> [
                    "conditional_table" => "main_pivots",
                    "conditional_table_alias" => "I",
                    "conditional_column" => "program_year",
                    "conditional_param" => "LIKE",
                    "conditional_value" => "'%$program_year%'",
                    ],
                ];
            $user_id = [
                "user_id" => [
                    "listId" => $employeeUser
                    ],
                ];
    
            $query =  $this->DynamicList([
                        'tableName' => $tableName,
                        'tableAlias' => $tableAlias,
                        'limit' => $limit,
                        'offset' => $offset,
                        'field' => $field,
                        'sortable' => $sortable,
                        'filterable' => $filterable,
                        'relation' => $relation,
                        'custom_relation' => $custom_relation,
                        'searchable' => $searchable,
                        'search' => $searchValue,
                        'condition' => $condition,
                        'req' => $req,
                        'users_id' => $user_id
                    ]);
            $get_data = DB::select($query['sql']);
            foreach($get_data as $datas){
                $detailResult = "SELECT SUM(CASE WHEN B.tree_category = 'Pohon_Kayu' THEN A.amount ELSE 0 END) AS pohon_kayu_detail, SUM(CASE WHEN B.tree_category = 'Pohon_Buah' THEN A.amount ELSE 0 END) AS pohon_mpts_detail, SUM(CASE WHEN B.tree_category = 'Tanaman_Bawah_Empon' THEN A.amount ELSE 0 END) AS tanaman_bawah_detail, SUM(CASE WHEN B.tree_category = 'Mangrove' THEN A.amount ELSE 0 END) AS pohon_mangrove_detail FROM `lahan_details` A LEFT JOIN trees B ON B.tree_code = A.tree_code  WHERE A.lahan_no = '". $datas->lahan_no ."' AND YEAR(A.detail_year) = '". $program_year."'";
                $datas->total_from_detail = DB::select($detailResult);
                if($datas->gis_polygon_area != 0){
                    $land_areas = $datas->gis_polygon_area;
                }else{
                    $land_areas = $datas->land_area;
                }
                $datas->current_land_area = $land_areas;
                $lahanProjectRelation = [
                    "project_no" => [
                        "reference_table" => "projects",
                        "table_alias" => "B",
                        "reference_column" => "project_no",
                        "display" => ['project_name'],
                        ],
                    "project_planting_purpose_id" => [
                        "reference_table" => "project_planting_purposes",
                        "table_alias" => "C",
                        "reference_column" => "id",
                        "display" => ['code'],
                        "origin_table" => "B"
                        ],
                    ];
                $getLahanProject = $this->DynamicDetail([
                    'sourceColumn' => 'lahan_no',
                    'id_type' => 'string',
                    'detail_id' => $datas->lahan_no,
                    'tableName' => 'lahan_projects',
                    'tableAlias' => 'A',
                    'field' => ['*'],
                    'relation' => $lahanProjectRelation,
                    'req' => $request
                ]); 
                $lahanDetailRelation = [
                    "tree_code" => [
                        "reference_table" => "trees",
                        "table_alias" => "B",
                        "reference_column" => "tree_code",
                        "display" => ['tree_name', 'tree_category'],
                        ],
                    ];
                $detailDataCondition = [
                    "detail_year)" => [
                        "conditional_table" => "lahan_details",
                        "conditional_table_alias" => "YEAR(A",
                        "conditional_column" => "detail_year",
                        "conditional_param" => "LIKE",
                        "conditional_value" => "'%$program_year%'",
                        ],
                ];
                $getLahanDetail = $this->DynamicDetail([
                    'sourceColumn' => 'lahan_no',
                    'id_type' => 'string',
                    'detail_id' => $datas->lahan_no,
                    'tableName' => 'lahan_details',
                    'tableAlias' => 'A',
                    'field' => ['*'],
                    'relation' => $lahanDetailRelation,
                    'condition' => $detailDataCondition,
                    'req' => $request
                ]); 
                
                $datas->detail_seeds = DB::select($getLahanDetail);
                $datas->detail_projects = DB::select($getLahanProject);
            }
            return response()->json(['data' => $get_data], 200);
            
        }
    }
    
    
    public function farmerMouFind(Request $request) {
        $validator = Validator::make($request -> all(),[
            'farmer_no' => 'required',
            'program_year' => 'required',
        ]);

        if($validator->fails()){
            $rslt =  $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 422);
        }

        $farmer_no = $request->farmer_no;
        $program_year = $request->program_year;

        $farmerData = DB::table('farmer_lahan_mou')->where('farmer_no', $farmer_no)->first();
        $farmerLahans = DB::table('main_pivots')->where([
            'key1' => $farmer_no,
            'type' => 'farmer_lahan',
        ])->where('program_year', 'like', '%' . $program_year . '%')->get();
        if (!$farmerData) {
            return response()->json([
                'data' => [
                    'id' => null,
                    'lahans' => $farmerLahans,
                    'mou_lahans' => [],
                ]
            ], 200);
        }
        

        $farmerMouLahan = DB::table('farmer_lahan_mou_lahan')->where('farmer_lahan_mou_id', $farmerData->id)->get();

        $farmerData->mou_lahans = $farmerMouLahan;
        $farmerData->lahans = $farmerMouLahan;

        return response()->json(['data' => $farmerData], 200);
    }

    
    
    public function farmerMouPrint(Request $request){
       $validator = Validator::make($request -> all(),[
            'farmer_no' => 'required',
            'program_year' => 'required',
        ]);

        if($validator->fails()){
            $rslt =  $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 422);
        }

        // Check if farmer exist
        $farmer = DB::table('farmers')->where('farmer_no', $request->farmer_no)->first();
        if (!$farmer) {
            return response()->json(['message' => 'Farmer not found'], 422);
        }

        // Check if farmer has lahan in 2024
        $allLahans = DB::table('main_pivots')->where([
            'key1' => $request->farmer_no,
            'type' => 'farmer_lahan',
        ])->where('program_year', 'like', '%' . $request->program_year . '%')->get();

        if (count($allLahans) == 0) {
            return response()->json(['message' => 'Farmer doesnt have lahan in 2024'], 422);
        }  

        // Check if farmer has mou in 2024
        $isExist = DB::table('farmer_lahan_mou')->where([
            'farmer_no' => $request->farmer_no,
            'program_year' => $request->program_year,
        ])->first();
        $_mouStatus = isset($request->mou_reject_reason) ? 2 : 1;
        

        if (!$isExist) {
            // Generate Mou No
            // [Nomor Urut]-[Jenis]/T4T-Legal/[Kode Lokasi]/[Bulan Dalam Romawi]/[Tahun]
            $countMou = DB::table('farmer_lahan_mou')->where('program_year', $request->program_year)->count();
            $month = Carbon::now()->format('F');
            $romawi = [
                'Januari' => 'I',
                'Februari' => 'II',
                'Maret' => 'III',
                'April' => 'IV',
                'Mei' => 'V',
                'Juni' => 'VI',
                'Juli' => 'VII',
                'Agustus' => 'VIII',
                'September' => 'IX',
                'Oktober' => 'X',
                'November' => 'XI',
                'Desember' => 'XII',
            ];

            $monthRomawi = $romawi[$month];
            $mouNo = $countMou + 1 . '/MoU/T4T-Legal/JWB/' . $monthRomawi . '/' . Carbon::now()->format('Y');
            $dataToInsert = [
                'farmer_no' => $request->farmer_no,
                'mou_no' => $mouNo,
                'program_year' => $request->program_year,
                'mou_status' => $_mouStatus,
            ];

            if ($_mouStatus == 2) {
                $dataToInsert['mou_revision_reason'] = $request->mou_reject_reason;
                $dataToInsert['printed_status'] = 0;
            }

            else if ($_mouStatus == 1) {
                $dataToInsert['printed_at'] = Carbon::now();
                $dataToInsert['printed_status'] = 1;
                $dataToInsert['mou_revision_reason'] = '';
            }

            else {
                return response()->json(['message' => 'Mou status unidentified'], 422);
            }

            $inserting = DB::table('farmer_lahan_mou')->insert($dataToInsert);

            if (!$inserting) {
                return response()->json(['result' => 'failed'], 422);
            }

            $insertedData = DB::table('farmer_lahan_mou')->where([
                'farmer_no' => $request->farmer_no,
                'mou_no' => $mouNo,
                'program_year' => $request->program_year,
            ])->first();

            return response()->json([
                'message' => 'Mou printed successfully',
                'result' => $insertedData
            ], 200);
        }

        else {
            $dataToUpdate = [
                'mou_status' => $_mouStatus
            ];

            if ($_mouStatus == 2) {
                $dataToUpdate['mou_revision_reason'] = $request->mou_reject_reason;
            }

            else if ($_mouStatus == 1) {
                $dataToUpdate['printed_at'] = Carbon::now();
                $dataToUpdate['printed_status'] = 1;
                $dataToInsert['printed_revision_reason'] = '';
            }

            else {
                return response()->json(['message' => 'Mou status unidentified'], 422);
            }

            $updating = DB::table('farmer_lahan_mou')->where([
                'farmer_no' => $request->farmer_no,
                'mou_no' => $isExist->mou_no,
                'program_year' => $request->program_year,
            ])->update($dataToUpdate);
            

            if (!$updating) {
                return response()->json(['result' => 'failed'], 422);
            }

            $updatedData = DB::table('farmer_lahan_mou')->where([
                'farmer_no' => $request->farmer_no,
                'mou_no' => $isExist->mou_no,
                'program_year' => $request->program_year,
            ])->first();

            return response()->json([
                'message' => 'Mou printed successfully',
                'result' => $updatedData
            ], 200);
        }
    }
    
    
    public function farmerMouPrintAppendix(Request $request) {
        
        $validator = Validator::make($request -> all(),[
            'mou_no' => 'required',
            'lahan_no' => 'required|string'
        ]);

        if($validator->fails()){
            $rslt =  $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 422);
        }


        $farmerMou = DB::table('farmer_lahan_mou')->where([
            'mou_no' => $request->mou_no
        ])->first();
        

        if (!$farmerMou) {
            return response()->json(['message' => 'MOU not found'], 422);
        }

        if ($farmerMou->mou_status == 2) {
            return response()->json(['message' => 'MOU status is revision'], 422);
        }

        if ($farmerMou->mou_status == 4) {
            return response()->json(['message' => 'MOU status is already signed'], 422);
        }

        if ($farmerMou->mou_status == 5) {
            return response()->json(['message' => 'MOU status is already verified'], 422);
        }

        
        $isExist = DB::table('farmer_lahan_mou_lahan')->where([
            'farmer_lahan_mou_id' => $farmerMou->id,
            'lahan_no' => $request->lahan_no
        ])->first();

        
        $allLahans = DB::table('main_pivots')->where([
            'key1' => $farmerMou->farmer_no,
            'type' => 'farmer_lahan',
        ])->where('program_year', 'like', '%' . $farmerMou->program_year . '%')->get();

        if (count($allLahans) == 0) {
            return response()->json(['message' => 'Farmer doesnt have lahan in 2024'], 422);
        }


        if (!$isExist) {
            $dataToInsert = [
                'farmer_lahan_mou_id' => $farmerMou->id,
                'lahan_no' => $request->lahan_no,
            ];

            $inserting = DB::table('farmer_lahan_mou_lahan')->insert($dataToInsert);

            if (!$inserting) {
                return response()->json(['result' => 'failed'], 422);
            }
            $allMouLahans = DB::table('farmer_lahan_mou_lahan')->where([
                'farmer_lahan_mou_id' => $farmerMou->id,
            ])->get();
            if (count($allLahans) == count($allMouLahans)) {
                DB::table('farmer_lahan_mou')->where('mou_no', $request->mou_no)->update([
                    'mou_status' => 3,
                ]);
            }
            return response()->json([
                'message' => 'MOU appendix printed successfully',
                'result' => DB::table('farmer_lahan_mou_lahan')->where('lahan_no', $request->lahan_no)->first()
            ], 200);
        }

        return response()->json(['message' => 'MOU appendix already printed'], 200);
    }

    public function farmerMouApprove(Request $request) {
        
        
        $validator = Validator::make($request -> all(),[
            'mou_no' => 'required',
        ]);

        if($validator->fails()){
            $rslt =  $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 422);
        }

        $isExist = DB::table('farmer_lahan_mou')->where([
            'mou_no' => $request->mou_no,
        ])->first();

        if (!$isExist) {
            return response()->json(['message' => 'MOU not found'], 422);
        }

        if ($isExist->mou_status < 4) {
            return response()->json(['message' => 'MOU status is not signed'], 422);
        }

        if ($isExist->mou_status == 5) {
            return response()->json(['message' => 'MOU status is already verified'], 422);
        }

        DB::table('farmer_lahan_mou')->where('mou_no', $request->mou_no)->update([
            'mou_status' => 5,
            'verified_at' => Carbon::now(),
        ]);

        return response()->json([
            'message' => 'MOU updated successfully',
            'result' => DB::table('farmer_lahan_mou')->where('mou_no', $request->mou_no)->first()
        ], 200);
    }
    
    public function updateFarmerLahanMOU_new(Request $request){
        $validatorVal = [
                'farmer_no' => 'required',
                'lahan_no' => 'required',
                'mou_no' => 'required',
                'program_year' => 'required', 
                'update_status' => 'required'
            ];
        $validator = Validator::make($request -> all(), $validatorVal);
        if($validator->fails()){
            $rslt =  $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        }else{
            $updateDatas = [];
            if($request->update_status == "print_mou"){
                $updateDatas = [
                    "0" => ['table_header' => 'printed_status',         'table_new_data' => "1",                'type' => 'int'],
                    "1" => ['table_header' => 'printed_at',             'table_new_data' => Carbon::now(),      'type' => 'string'],
                    "2" => ['table_header' => 'mou_status',             'table_new_data' => "1",                'type' => 'int'],
                ];
            }else if($request->update_status == "reject_mou"){
                $validatorVal['mou_revision_reason'] = "required";
                $updateDatas = [
                    "1" => ['table_header' => 'mou_revision_reason',    'table_new_data' => $request->mou_revision_reason,      'type' => 'string'],
                    "2" => ['table_header' => 'mou_status',             'table_new_data' => "2",                'type' => 'int'],
                ];
            }else if($request->update_status == "approve_mou"){
                $updateDatas = [
                    "1" => ['table_header' => 'verified_at',            'table_new_data' => Carbon::now(),      'type' => 'string'],
                    "2" => ['table_header' => 'mou_status',             'table_new_data' => "3",                'type' => 'int'],
                ];
            }else if($request->update_status == "clean_no_clear"){
                $validatorVal['land_not_sengketa_photo'] = "required";
                $validatorVal['land_proof_photo'] = "required";
                $updateDatas = [
                    "0" => ['table_header' => 'land_not_sengketa_photo',    'table_new_data' => $request->land_not_sengketa_photo,      'type' => 'string'],
                    "1" => ['table_header' => 'land_proof_photo',           'table_new_data' => $request->land_proof_photo,      'type' => 'string'],
                    "2" => ['table_header' => 'mou_status',                 'table_new_data' => "4",                'type' => 'int'],
                ];
            }else if($request->update_status == "clean_and_clear"){
                $validatorVal['land_ownership_photo'] = "required";
                $validatorVal['mou_file'] = "required";
                $validatorVal['polygon_image'] = "required";
                $updateDatas = [
                    "0" => ['table_header' => 'land_ownership_photo',       'table_new_data' => $request->land_ownership_photo,        'type' => 'string'],
                    "1" => ['table_header' => 'mou_file',                   'table_new_data' => $request->mou_file,                         'type' => 'string'],
                    "2" => ['table_header' => 'polygon_image',              'table_new_data' => $request->polygon_image,        'type' => 'string'],
                    "3" => ['table_header' => 'signed_at',                   'table_new_data' => $request->signed_at ?? Carbon::now(),                         'type' => 'string'],
                    "4" => ['table_header' => 'mou_status',                 'table_new_data' => "4",                                'type' => 'int'],
                ];
                $updatefarmers = [
                    "0" => ['table_header' => 'farmer_carbon_status',       'table_new_data' => "1",        'type' => 'int'],
                ];
                $farmerdatas =  $this->dynamicUpdate([
                            'current_id' => $request->farmer_no,
                            'tableName' => 'farmers',
                            'inputData' => $updatefarmers,
                            'other_id_index' => 'farmer_no',
                            'id_data_type' => 'string',
                            'condition' => []
                        ]);
                $farmerdatas_res = DB::update($farmerdatas);
            }else{
                return response()->json('silahkan masukan jenis update yang benar (print_mou | reject_mou | approve_mou | clean_no_clear | clean_and_clear)',400);
            }
            $validator = Validator::make($request -> all(), $validatorVal);
            if($validator->fails()){
                $rslt =  $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
                return response()->json($rslt, 400);
            }
            $updateMOUCondition = [
                    'farmer_no'=>[
                            'value' => "'".$request->farmer_no."'",
                            'operator' => '=',
                            'table_name' => 'farmer_lahan_mou'
                        ],
                    'mou_no'=>[
                            'value' => "'".$request->mou_no."'",
                            'operator' => '=',
                            'table_name' => 'farmer_lahan_mou'
                        ],
                    'program_year'=>[
                            'value' => "'".$request->program_year."'",
                            'operator' => '=',
                            'table_name' => 'farmer_lahan_mou'
                        ],
                    
                    ];
            $datas =  $this->dynamicUpdate([
                            'current_id' => $request->lahan_no,
                            'tableName' => 'farmer_lahan_mou',
                            'inputData' => $updateDatas,
                            'other_id_index' => 'lahan_no',
                            'id_data_type' => 'string',
                            'condition' => $updateMOUCondition
                        ]);
            $datas_res = DB::update($datas);
            return response()->json([
                'update_result' => $datas_res,
                'farmer_result' => $farmerdatas_res ?? "test hehe :')"
            ],200);
        }
    }
    public function deleteFarmerLahanMOU_new(Request $request){
         $validatorVal = [
                'id' => 'required',
                'farmer_no' => 'required'
            ];
        $validator = Validator::make($request -> all(), $validatorVal);
        if($validator->fails()){
            $rslt =  $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        }else{
            $updatefarmers = [
                "0" => ['table_header' => 'farmer_carbon_status',       'table_new_data' => "0",        'type' => 'int'],
            ];
            $farmerdatas =  $this->dynamicUpdate([
                        'current_id' => $request->farmer_no,
                        'tableName' => 'farmers',
                        'inputData' => $updatefarmers,
                        'other_id_index' => 'farmer_no',
                        'id_data_type' => 'string',
                        'condition' => []
                    ]);
            $farmerdatas_res = DB::update($farmerdatas);
            
            $deleteFarmerLahanMOU = $this->DynamicDelete([
                'current_id' => $request->id,
                'tableName' => 'farmer_lahan_mou',
            ]);
            $deleteProjectTerm_res = DB::delete($deleteFarmerLahanMOU);
            return response()->json([
                'delete_result' => $deleteProjectTerm_res,
                'update_farmers_result' => $farmerdatas_res?? 'warning! farmer data not found!'
            ],200);
        }
    }
    
    public function addLahanTermAnswer_new(Request $request){
        $validator = Validator::make($request->all(), [
                'lahan_no' => 'required',
                'term_id' => 'required',
                'term_answer' => 'required',
                'program_year' => 'required'
            ]);
        if($validator->fails()){
            $rslt =  $this->ResultReturn(400, $validator->errors(), $validator->errors());
            return response()->json($rslt, 400);
        } else {
            $tableName = 'lahan_project_terms';
            $createDatas = [ 
                    "0" => ['table_header' => 'lahan_no',                   'table_new_data' => $request->lahan_no,                             'type' => 'string'],
                    "1" => ['table_header' => 'term_id',                    'table_new_data' => $request->term_id,                              'type' => 'int'],
                    "2" => ['table_header' => 'term_answer',                'table_new_data' => $request->term_answer,                          'type' => 'int'],
                    "3" => ['table_header' => 'program_year',               'table_new_data' => $request->program_year,                         'type' => 'int'],
                    "4" => ['table_header' => 'is_del',                     'table_new_data' => 0,                                              'type' => 'int'],
                    "5" => ['table_header' => 'created_at',                 'table_new_data' => Carbon::now()],
                    "6" => ['table_header' => 'created_by',                 'table_new_data' => $request->user_id ?? Auth::user()->email ?? '-','type' => 'string'],
                    "7" => ['table_header' => 'updated_at',                 'table_new_data' => Carbon::now()]
                    ];
                        
                    $datas =  $this->dynamicCreate([
                                'tableName' => $tableName,
                                'inputData' => $createDatas,
                            ]);
                    
                    $result = DB::insert($datas);
                    
                    return response()->json([
                        'result' => $result,
                        ], 200);    
            
        }
    }
    public function updateLahantermAnswer_new(Request $request){
        $validator = Validator::make($request -> all(), [
            // 'current_id' => 'required',
            'lahan_no' => 'required',
            'term_id' => 'required',
            'term_answer' => 'required',
            'program_year' => 'required' 
            ]);
            if($validator->fails()){
                $rslt =  $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
                return response()->json($rslt, 400);
            }
            else{
                
                // Base Code
                $current_id = $request->current_id;
                $tableName = 'lahan_project_terms';
                
                $updateTermCondition = [
                    'term_id'=>[
                            'value' => "'".$request->term_id."'",
                            'operator' => '=',
                            'table_name' => $tableName
                            ]
                    ];
            
                $updateDatas = [ 
                    // "0" => ['table_header' => 'term_id',                'table_new_data' => $request->term_id,         'type' => 'string'],
                    "1" => ['table_header' => 'term_answer',            'table_new_data' => $request->term_answer,           'type' => 'string'],
                    "2" => ['table_header' => 'program_year',           'table_new_data' => $request->program_year,      'type' => 'string'],
                    
                    "3" => ['table_header' => 'updated_at',             'table_new_data' => Carbon::now()]
                    ];
                    
                
                $datas =  $this->dynamicUpdate([
                            'current_id' => $request->lahan_no,
                            'tableName' => $tableName,
                            'inputData' => $updateDatas,
                            'other_id_index' => 'lahan_no',
                            'id_data_type' => 'string',
                            'condition' => $updateTermCondition
                        ]);
                        
                $result = DB::update($datas);
                return response()->json([
                    'result' => $result,
                    'sql' => $datas
                    ], 200);
                
            }
    }
    public function UpdateLahanApproval_new(Request $request){
        $validator = Validator::make($request -> all(), [
            'current_id' => 'required',
            'moduls' => 'required', // verification/unverification
            ]);
            $getUserRole = DB::table('employees')->where(['nik' => Auth::user()->employee_no])->pluck('position_no')->toArray();
            if($validator->fails()){
                $rslt =  $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
                return response()->json($rslt, 400);
            }
            else{
                
                // Base Code
                $current_id = $request->current_id;
                $tableName = 'lahans';
                
                if($request->moduls == 'verification'){
                    if($request->approval_status == 0){
                        $updateDatas = [ 
                            "0" => ['table_header' => 'approve',                'table_new_data' => 2,         'type' => 'string'],
                            "1" => ['table_header' => 'approved_at',                'table_new_data' => Carbon::now()],
                            "2" => ['table_header' => 'approved_by',                'table_new_data' => $request->user_id ?? Auth::user()->email ?? '-', 'type' => 'string'],
                            "3" => ['table_header' => 'updated_at',                 'table_new_data' => Carbon::now()]
                            ];
                    }else if($request->approval_status == 1 ){
                        $updateDatas = [ 
                            "0" => ['table_header' => 'approve',                'table_new_data' => 1,         'type' => 'string'],
                            "1" => ['table_header' => 'approved_at',                'table_new_data' => Carbon::now()],
                            "2" => ['table_header' => 'approved_by',                'table_new_data' => $request->user_id ?? Auth::user()->email ?? '-', 'type' => 'string'],
                            "3" => ['table_header' => 'updated_at',                 'table_new_data' => Carbon::now()]
                            ];
                    }else if($request->approval_status == 2){
                        $updateDatas = [ 
                            "0" => ['table_header' => 'approve',                'table_new_data' => 2,         'type' => 'string'],
                            "1" => ['table_header' => 'approved_at',                'table_new_data' => Carbon::now()],
                            "2" => ['table_header' => 'approved_by',                'table_new_data' => $request->user_id ?? Auth::user()->email ?? '-', 'type' => 'string'],
                            "3" => ['table_header' => 'updated_at',                 'table_new_data' => Carbon::now()]
                            ];
                    }else{
                        return response()->json('Gagal Membaca Role User, Silahkan Gunakan Akun FC dan UM', 400);
                    }
                }else if($request->moduls == 'unverification'){
                    if($request->approval_status == 1){
                        $updateDatas = [ 
                            "0" => ['table_header' => 'approve',                    'table_new_data' => 0,         'type' => 'string'],
                            "1" => ['table_header' => 'approved_at',                'table_new_data' => 'NULL' ,        'type' => 'int'],
                            "2" => ['table_header' => 'approved_by',                'table_new_data' => 'NULL' ,        'type' => 'int'],
                            "3" => ['table_header' => 'force_majeure_description',  'table_new_data' => 'NULL' ,        'type' => 'int'],
                            "4" => ['table_header' => 'updated_at',                 'table_new_data' => Carbon::now()]
                        ];
                        $termCondition = [
                            'term_id'=>[
                                'value' => "(3,4,5,6,7)",
                                'operator' => 'IN',
                                'table_name' => 'lahan_project_terms'
                                ],
                            ];
                        $deleteProjectTerms = $this->DynamicDelete([
                            'current_id' => $request->lahan_no,
                            'tableName' => 'lahan_project_terms',
                            'other_id_index' => 'lahan_no',
                            'index_data_type' => 'string',
                            'condition' => $termCondition
                        ]);
                        $deleteProjectTerm_res = DB::delete($deleteProjectTerms);
                        
                    }else if($request->approval_status == 2){
                        $updateDatas = [ 
                            "0" => ['table_header' => 'approve',                    'table_new_data' => 1,         'type' => 'string'],
                            "1" => ['table_header' => 'approved_at',                'table_new_data' => 'NULL' ,        'type' => 'int'],
                            "2" => ['table_header' => 'approved_by',                'table_new_data' => $request->fc_email, 'type' => 'string'],
                            "3" => ['table_header' => 'updated_at',                 'table_new_data' => Carbon::now()],
                            "4" => ['table_header' => 'eligible_status',                'table_new_data' => 'NULL' ,        'type' => 'int'], 
                            "5" => ['table_header' => 'update_eligible_at',             'table_new_data' => 'NULL' ,        'type' => 'int'],
                            "6" => ['table_header' => 'update_eligible_by',             'table_new_data' => 'NULL' ,        'type' => 'int'],
                            ];
                    }else if($request->approval_status == 3){
                        $updateDatas = [ 
                            "0" => ['table_header' => 'updated_gis',                    'table_new_data' => 'belum',         'type' => 'string'],
                            "1" => ['table_header' => 'polygon_from_gis',                'table_new_data' => 'NULL' ,        'type' => 'int'],
                            "2" => ['table_header' => 'gis_polygon_area',                'table_new_data' => '0',             'type' => 'int'],
                            "3" => ['table_header' => 'gis_planting_area',              'table_new_data' => '0' ,        'type' => 'int'],
                            "4" => ['table_header' => 'gis_updated_at',                 'table_new_data' => 'NULL' ,        'type' => 'int'],
                            "5" => ['table_header' => 'gis_officer',                    'table_new_data' => 'NULL' ,        'type' => 'int'],
                            ];
                    }else{
                        return response()->json('Gagal Membaca Role User, Silahkan Gunakan Akun FC dan UM', 400);
                    }
                    
                }else if($request->moduls == 'force_majeure'){
                    $updateDatas = [ 
                        "0" => ['table_header' => 'approve',                'table_new_data' => 3,         'type' => 'string'],
                        "1" => ['table_header' => 'approved_at',                'table_new_data' => Carbon::now()],
                        "2" => ['table_header' => 'approved_by',                'table_new_data' => $request->user_id ?? Auth::user()->email ?? '-', 'type' => 'string'],
                        "3" => ['table_header' => 'updated_at',                 'table_new_data' => Carbon::now()],
                        "4" => ['table_header' => 'force_majeure_description',                 'table_new_data' => $request->force_majeure_description,     'type' => 'string']
                        
                        ];
                }
            
                    
                
                $datas =  $this->dynamicUpdate([
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
    public function UpdateSeedAmountVerification_new(Request $request){
        $validator = Validator::make($request->all(), [
                'verif_moduls' => 'required', //unverif or verif
                'current_id' => 'required'
            ]);
        if($validator->fails()){
            $rslt = $this->ReturnResult(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        }else{
            if($request->verif_moduls == 'verif'){
                $updateDatas = [ 
                    "0" => ['table_header' => 'seed_is_modified',               'table_new_data' => '1',            'type' => 'int'],
                    "1" => ['table_header' => 'seed_verify_status',             'table_new_data' => '1',            'type' => 'int'],
                    "2" => ['table_header' => 'seed_verify_at',                 'table_new_data' => Carbon::now()],
                    "3" => ['table_header' => 'seed_verify_by',                 'table_new_data' => $request->user_id ?? Auth::user()->email ?? '-',     'type' => 'string'],
                    "4" => ['table_header' => 'updated_at',                     'table_new_data' => Carbon::now()]
                    ];
                    
            }else if($request->verif_moduls == 'unverif'){
                $updateDatas = [ 
                        "0" => ['table_header' => 'seed_is_modified',           'table_new_data' => "NULL",           'type' => 'int'],
                        "1" => ['table_header' => 'seed_verify_status',         'table_new_data' => "NULL",           'type' => 'int'],
                        "2" => ['table_header' => 'seed_verify_at',             'table_new_data' => "NULL",           'type' => 'int'],
                        "3" => ['table_header' => 'seed_verify_by',             'table_new_data' => "NULL",           'type' => 'int'],
                        "4" => ['table_header' => 'updated_at',                 'table_new_data' => Carbon::now(),               'type' => 'string'],
                    ];
            }else{
                return response()->json("Mohon Pilih Antara Modul 'verif' atau 'unverif'", 400);
            }
                $datas =  $this->dynamicUpdate([
                            'current_id' => $request -> current_id,
                            'tableName' => 'lahans',
                            'inputData' => $updateDatas,
                        ]);
                        
                $result = DB::update($datas);
                return response()->json([
                    'result' => $result,
                    // 'sql' => $datas
                    ], 200);
                }
    }
    public function UpdateLandMOUStatus_new(Request $request){
        $requestDatas = [
                'lahan_no' => 'required',
                'users' => 'required' //UM || RM
            ];
        if($request->users == 'UM'){
            $requestDatas['mou_no'] = 'required';
            $requestDatas['attachment_path'] = 'required';
            $requestDatas['update_module'] = 'required'; //update || delete
            
            $validator = Validator::make($request -> all(), $requestDatas);
                if($validator->fails()){
                    $rslt =  $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
                    return response()->json($rslt, 400);
                }
                else{
                    if($request->update_module == 'update'){
                        $updateDatas = [
                            "1" => ['table_header' => 'land_mou_agreement',             'table_new_data' => $request->mou_no,           'type' => 'string'],
                            "2" => ['table_header' => 'land_mou_attachment',            'table_new_data' => $request->attachment_path,  'type' => 'string'],
                            ];
                    }
                    else if($request->update_module == 'delete'){
                        $updateDatas = [
                            "1" => ['table_header' => 'land_mou_agreement',             'table_new_data' => "NULL",                     'type' => 'int'],
                            "2" => ['table_header' => 'land_mou_attachment',            'table_new_data' => "NULL",                     'type' => 'int'],
                            ];
                    }
                    $updateMOUCondition = [
                        // 'eligible_status'=>[
                        //         'value' => "1",
                        //         'operator' => '=',
                        //         'table_name' => 'lahans'
                        //     ],
                        // 'eligible_status2'=>[
                        //         'value' => "2",
                        //         'operator' => '=',
                        //         'table_name' => 'lahans',
                        //         'custom_key' => 'eligible_status'
                        //     ],
                        ];
                    $custom_update_condition = "(lahans.eligible_status = 1 OR lahans.eligible_status = 2)";
                    $datas =  $this->dynamicUpdate([
                                'current_id' => $request->lahan_no,
                                'tableName' => 'lahans',
                                'inputData' => $updateDatas,
                                'other_id_index' => 'lahan_no',
                                'id_data_type' => 'string',
                                'condition' => $updateMOUCondition,
                                'custom_condition' => $custom_update_condition
                            ]);
                    $res = DB::update($datas);
                }
        }else if($request->users == 'RM'){
            $requestDatas['mou_status'] = 'required'; //verification || unverification
            
            $validator = Validator::make($request -> all(), $requestDatas);
                if($validator->fails()){
                    $rslt =  $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
                    return response()->json($rslt, 400);
                }
                else{
                    if($request->mou_status == 'verification'){
                        $updateDatas = [
                            "0" => ['table_header' => 'mou_complete_status',            'table_new_data' => "1",                        'type' => 'int'],
                            ];
                    }
                    else if($request->mou_status == 'unverification'){
                        $updateDatas = [
                            "0" => ['table_header' => 'mou_complete_status',            'table_new_data' => "0",                        'type' => 'int'],
                            ];
                    }
                    $updateMOUCondition = [
                        // 'eligible_status'=>[
                        //         'value' => "1",
                        //         'operator' => '=',
                        //         'table_name' => 'lahans'
                        //         ],
                        // 'eligible_status2'=>[
                        //         'value' => "2",
                        //         'operator' => '=',
                        //         'table_name' => 'lahans',
                        //         'custom_key' => 'eligible_status'
                        //     ],
                        ];
                    $custom_update_condition = "(lahans.eligible_status = 1 OR lahans.eligible_status = 2)";
                    $datas =  $this->dynamicUpdate([
                                'current_id' => $request->lahan_no,
                                'tableName' => 'lahans',
                                'inputData' => $updateDatas,
                                'other_id_index' => 'lahan_no',
                                'id_data_type' => 'string',
                                'condition' => $updateMOUCondition,
                                'custom_condition' => $custom_update_condition
                            ]);
                    $res = DB::update($datas);
                }
        }else{
            $res = "Please Insert Valid Role :-)";
        }
        
        
        return response()->json([
            'result' => $res,
            'sql' => $datas ?? '-'
            ],200);
    }
    public function UpdateLahanEligibleStatus_new(Request $request){
        $validator = Validator::make($request -> all(), [
            'current_id' => 'required',
            'eligible_status' => 'required',
            ]);
            if($validator->fails()){
                $rslt =  $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
                return response()->json($rslt, 400);
            }
            else{
                
                // Base Code
                $current_id = $request->current_id;
                $tableName = 'lahans';
                $updateDatas = [ 
                    "0" => ['table_header' => 'eligible_status',                'table_new_data' => $request->eligible_status,         'type' => 'string'],
                    "1" => ['table_header' => 'update_eligible_at',             'table_new_data' => carbon::now()],
                    "2" => ['table_header' => 'update_eligible_by',             'table_new_data' => $request->user_id ?? Auth::user()->email ?? '-',         'type' => 'string'],
                    "3" => ['table_header' => 'updated_at',                     'table_new_data' => Carbon::now()]
                    ];
                $datas =  $this->dynamicUpdate([
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
    public function UpdateLahanFCCompleteStatus_new(Request $request){
        $validator = Validator::make($request -> all(), [
            'current_id' => 'required',
            'fc_complete_data' => 'required',
            ]);
            if($validator->fails()){
                $rslt =  $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
                return response()->json($rslt, 400);
            }
            else{
                
                // Base Code
                $current_id = $request->current_id;
                $tableName = 'lahans';
                    $updateDatas = [ 
                        "0" => ['table_header' => 'fc_complete_data',                'table_new_data' => $request->fc_complete_data,         'type' => 'int'],
                        "1" => ['table_header' => 'fc_complete_data_at',             'table_new_data' => carbon::now()],
                        "2" => ['table_header' => 'fc_complete_data_by',             'table_new_data' => $request->user_id ?? Auth::user()->email ?? '-',         'type' => 'string'],
                        "3" => ['table_header' => 'updated_at',                     'table_new_data' => Carbon::now()]
                        ];
                if($request->fc_complete_data == 2){
                    $updateDatas = [ 
                        "0" => ['table_header' => 'fc_complete_data',               'table_new_data' => 'NULL',         'type' => 'int'],
                        "1" => ['table_header' => 'fc_complete_data_at',            'table_new_data' => 'NULL',         'type' => 'int'],
                        "2" => ['table_header' => 'fc_complete_data_by',            'table_new_data' => 'NULL',         'type' => 'int'],
                        "3" => ['table_header' => 'updated_at',                     'table_new_data' => Carbon::now()],
                        // "4" => ['table_header' => 'approve',                        'table_new_data' => '1',         'type' => 'int'],
                        ];
                }
                $datas =  $this->dynamicUpdate([
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
    public function updateGISPlantingArea(Request $request){
        $validator = Validator::make($request -> all(), [
            'lahan_no' => 'required',
            'gis_planting_area' => 'required',
            ]);
            if($validator->fails()){
                $rslt = $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
                return response()->json($rslt, 400);
            }
            else{
                $updateDatas = [ 
                        "1" => ['table_header' => 'gis_planting_area',                   'table_new_data' => $request->gis_planting_area,                             'type' => 'int'],
                    ];
                $UpdateDatasLahan =  $this->dynamicUpdate([
                    'current_id' => $request->lahan_no,
                    'tableName' => "lahans",
                    'inputData' => $updateDatas,
                    'other_id_index' => 'lahan_no',
                    'id_data_type' => 'string'
                ]);
                $update_res = DB::update($UpdateDatasLahan);
                
                return response()->json([
                    'update_planting_area_res' => $update_res
                    ]);
            }
    }
    public function UpdateLahanSoilType_new(Request $request){
        $validator = Validator::make($request -> all(), [
            'current_id' => 'required',
            'soil_type' => 'required',
            ]);
            if($validator->fails()){
                $rslt =  $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
                return response()->json($rslt, 400);
            }
            else{
                
                $updateDatas = [
                    "1" => ['table_header' => 'soil_type',                     'table_new_data' => $request->soil_type,                            'type' => 'string'],
                ];
                    
                $datas =  $this->dynamicUpdate([
                            'current_id' => $request->current_id,
                            'tableName' => 'lahans',
                            'inputData' => $updateDatas,
                        ]);
                        
                $result = DB::update($datas);
                
                return response()->json([
                    'result' => $result,
                    'sql' => $datas
                ], 200);
            }
        
    }
    
    public function UpdateLahanByGIS_new(Request $request){
        $validator = Validator::make($request -> all(), [
            'current_id' => 'required',
            'polygon_from_gis' => 'required',
            // 'land_area' => 'required',
            // 'planting_area' => 'required',
            'elevation' => 'required',
            // 'kelerengan_lahan' => 'required',
            // 'tutupan_lahan' => 'required',
            // 'tutupan_pohon_percentage' => 'required',
            // 'tutupan_pohon_photo' => 'required',
            // 'tutupan_tanaman_bawah_percentage' => 'required',
            // 'tutupan_tanaman_bawah_photo' => 'required',
            // 'tutupan_lain_bangunan_percentage' => 'required',
            // 'tutupan_lain_bangunan_photo' => 'required',
            
            // 'access_to_lahan' => 'required',
            // 'jarak_lahan' => 'required',
            // 'water_availability_level' => 'required',
            // 'water_availability' => 'required',
            // 'access_to_water_sources' => 'required',
            // 'nearby_village' => 'required',
            // 'nearby_village_distance' => 'required',
            
            // 'floods' => 'required',
            // 'wildfire' => 'required',
            // 'landslide' => 'required',
            // 'drought' => 'required',
            // 'animal_protected_habitat' => 'required',
            // 'animal_protected_habitat_distance' => 'required',
            ]);
            if($validator->fails()){
                $rslt =  $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
                return response()->json($rslt, 400);
            }
            else{
                
                // Base Code
                $current_id = $request->current_id;
                $tableName = 'lahans';
            
                $updateDatas = [ 
                    "0" => ['table_header' => 'polygon_from_gis',               'table_new_data' => $request->polygon_from_gis,         'type' => 'string'],
                    "1" => ['table_header' => 'land_area',                      'table_new_data' => $request->land_area,                'type' => 'int'],
                    "2" => ['table_header' => 'planting_area',                  'table_new_data' => $request->planting_area,            'type' => 'int'],
                    "3" => ['table_header' => 'elevation',                      'table_new_data' => $request->elevation,                'type' => 'string'],
                    "4" => ['table_header' => 'kelerengan_lahan',               'table_new_data' => $request->kelerengan_lahan,         'type' => 'string'],
                    "5" => ['table_header' => 'tutupan_lahan',                  'table_new_data' => $request->tutupan_lahan,            'type' => 'string'],
                    "6" => ['table_header' => 'tutupan_pohon_percentage',       'table_new_data' => $request->tutupan_pohon_percentage, 'type' => 'string'],
                    "7" => ['table_header' => 'tutupan_pohon_photo',            'table_new_data' => $request->tutupan_pohon_photo,      'type' => 'string'],
                    "8" => ['table_header' => 'tutupan_tanaman_bawah_percentage',       'table_new_data' => $request->tutupan_tanaman_bawah_percentage, 'type' => 'string'],
                    "9" => ['table_header' => 'tutupan_tanaman_bawah_photo',            'table_new_data' => $request->tutupan_tanaman_bawah_photo,      'type' => 'string'],
                    "10" => ['table_header' => 'tutupan_lain_bangunan_percentage',      'table_new_data' => $request->tutupan_lain_bangunan_percentage, 'type' => 'string'],
                    "11" => ['table_header' => 'tutupan_lain_bangunan_photo',           'table_new_data' => $request->tutupan_lain_bangunan_photo,      'type' => 'string'],
                    "12" => ['table_header' => 'access_to_lahan',               'table_new_data' => $request->access_to_lahan,          'type' => 'string'],
                    "13" => ['table_header' => 'jarak_lahan',                   'table_new_data' => $request->jarak_lahan,              'type' => 'string'],
                    "14" => ['table_header' => 'water_availability_level',      'table_new_data' => $request->water_availability_level, 'type' => 'int'],
                    "15" => ['table_header' => 'water_availability',            'table_new_data' => $request->water_availability,       'type' => 'string'],
                    "16" => ['table_header' => 'access_to_water_sources',       'table_new_data' => $request->access_to_water_sources,  'type' => 'string'],
                    "17" => ['table_header' => 'nearby_village',                'table_new_data' => $request->nearby_village,           'type' => 'string'],
                    "18" => ['table_header' => 'nearby_village_distance',       'table_new_data' => $request->nearby_village_distance,  'type' => 'string'],
                    "19" => ['table_header' => 'floods',                        'table_new_data' => $request->floods,                   'type' => 'string'],
                    "20" => ['table_header' => 'wildfire',                      'table_new_data' => $request->wildfire,                 'type' => 'string'],
                    "21" => ['table_header' => 'landslide',                     'table_new_data' => $request->landslide,                'type' => 'string'],
                    "22" => ['table_header' => 'drought',                       'table_new_data' => $request->drought,                  'type' => 'string'],
                    "23" => ['table_header' => 'animal_protected_habitat',              'table_new_data' => $request->animal_protected_habitat,         'type' => 'int'],
                    "24" => ['table_header' => 'animal_protected_habitat_distance',     'table_new_data' => $request->animal_protected_habitat_distance,'type' => 'int'],
                    "25" => ['table_header' => 'gis_polygon_area',                      'table_new_data' => $request->gis_polygon_area,                'type' => 'int'],
                    "26" => ['table_header' => 'gis_planting_area',                       'table_new_data' => $request->gis_planting_area,                         'type' => 'int'],
                    
                    "27" => ['table_header' => 'updated_at',                    'table_new_data' => Carbon::now()],
                    "28" => ['table_header' => 'gis_updated_at',                'table_new_data' => Carbon::now()],
                    "29" => ['table_header' => 'gis_officer',                   'table_new_data' => $request->user_id ?? Auth::user()->email ?? '-', 'type' => 'string'],
                    "30" => ['table_header' => 'updated_gis',                   'table_new_data' => "Sudah",                            'type' => 'string'],
                    "31" => ['table_header' => 'soil_type',                     'table_new_data' => $request->soil_type,                            'type' => 'string'],
                    ];
                    
                
                $datas =  $this->dynamicUpdate([
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
    
    public function UpdateReusableLahan_new(Request $request){
        $validator = Validator::make($request->all(),[
                "lahan_no" => 'required',
                "program_year" => 'required',
            ]);
        if($validator->fails()){
            $rslt =  $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        }
        else{
            //Log Main Lahans
            $getLahanDatas = $this->DynamicDetail([
                'sourceColumn' => 'lahan_no',
                'id_type' => 'string',
                'detail_id' => $request->lahan_no,
                'tableName' => 'lahans',
                'tableAlias' => 'A',
                'field' => ['*'],
                'relation' => [],
                'req' => $request
            ]);
            $getLahanDatas_result = DB::select($getLahanDatas);
            if($getLahanDatas_result[0]->approve == 1){
                $createDatas = [
                    "1" => ['table_header' => 'lahan_no',                   'table_new_data' => $getLahanDatas_result[0]->lahan_no,                             'type' => 'string'],
                    "2" => ['table_header' => 'program_year',               'table_new_data' => $request->program_year,                         'type' => 'string'],
                    "3" => ['table_header' => 'document_no',                'table_new_data' => $getLahanDatas_result[0]->document_no,                          'type' => 'string'],
                    "4" => ['table_header' => 'internal_code',              'table_new_data' => $getLahanDatas_result[0]->internal_code,                          'type' => 'string'],
                    "5" => ['table_header' => 'land_area',                  'table_new_data' => $getLahanDatas_result[0]->land_area,                            'type' => 'string'],
                    "6" => ['table_header' => 'planting_area',              'table_new_data' => $getLahanDatas_result[0]->planting_area,                        'type' => 'string'],
                    "7" => ['table_header' => 'longitude',                  'table_new_data' => $getLahanDatas_result[0]->longitude,                        'type' => 'string'],
                    
                    "8" => ['table_header' => 'latitude',                           'table_new_data' => $getLahanDatas_result[0]->latitude,                                   'type' => 'string'],
                    "9" => ['table_header' => 'coordinate',                         'table_new_data' => $getLahanDatas_result[0]->coordinate,                             'type' => 'string'],
                    "10" => ['table_header' => 'polygon',                            'table_new_data' => $getLahanDatas_result[0]->polygon,                         'type' => 'string'],
                    "11" => ['table_header' => 'nearby_village',                     'table_new_data' => $getLahanDatas_result[0]->nearby_village,                          'type' => 'string'],
                    "12" => ['table_header' => 'nearby_village_distance',            'table_new_data' => $getLahanDatas_result[0]->nearby_village_distance,                          'type' => 'string'],
                    "13" => ['table_header' => 'village',                            'table_new_data' => $getLahanDatas_result[0]->village,                            'type' => 'string'],
                    "14" => ['table_header' => 'kecamatan',                          'table_new_data' => $getLahanDatas_result[0]->kecamatan,                        'type' => 'string'],
                    "15" => ['table_header' => 'city',                               'table_new_data' => $getLahanDatas_result[0]->city,                        'type' => 'string'],
                    
                    "16" => ['table_header' => 'province',                           'table_new_data' => $getLahanDatas_result[0]->province,                                   'type' => 'string'],
                    "17" => ['table_header' => 'description',                        'table_new_data' => $getLahanDatas_result[0]->description,                             'type' => 'string'],
                    "18" => ['table_header' => 'elevation',                          'table_new_data' => $getLahanDatas_result[0]->elevation,                         'type' => 'string'],
                    "19" => ['table_header' => 'soil_type',                          'table_new_data' => $getLahanDatas_result[0]->soil_type,                          'type' => 'string'],
                    "20" => ['table_header' => 'soil_photo',                         'table_new_data' => $getLahanDatas_result[0]->soil_photo,                          'type' => 'string'],
                    "21" => ['table_header' => 'current_crops',                      'table_new_data' => $getLahanDatas_result[0]->current_crops,                            'type' => 'string'],
                    "22" => ['table_header' => 'active',                             'table_new_data' => $getLahanDatas_result[0]->active,                        'type' => 'string'],
                    "23" => ['table_header' => 'farmer_no',                          'table_new_data' => $getLahanDatas_result[0]->farmer_no,                        'type' => 'string'],
                    
                    "24" => ['table_header' => 'farmer_temp',                        'table_new_data' => $getLahanDatas_result[0]->farmer_temp,                                   'type' => 'string'],
                    "25" => ['table_header' => 'mu_no',                              'table_new_data' => $getLahanDatas_result[0]->mu_no,                             'type' => 'string'],
                    "26" => ['table_header' => 'target_area',                        'table_new_data' => $getLahanDatas_result[0]->target_area,                         'type' => 'string'],
                    "27" => ['table_header' => 'user_id',                            'table_new_data' => $getLahanDatas_result[0]->user_id,                          'type' => 'string'],
                    "28" => ['table_header' => 'created_time',                       'table_new_data' => $getLahanDatas_result[0]->created_time,                          'type' => 'string'],
                    "29" => ['table_header' => 'created_at',                         'table_new_data' => $getLahanDatas_result[0]->created_at,                            'type' => 'string'],
                    "30" => ['table_header' => 'updated_at',                         'table_new_data' => $getLahanDatas_result[0]->updated_at,                        'type' => 'string'],
                    "31" => ['table_header' => 'sppt',                               'table_new_data' => $getLahanDatas_result[0]->sppt,                        'type' => 'string'],
                    
                    "32" => ['table_header' => 'tutupan_lahan',                              'table_new_data' => $getLahanDatas_result[0]->tutupan_lahan,                                   'type' => 'string'],
                    "33" => ['table_header' => 'tutupan_pohon_percentage',                   'table_new_data' => $getLahanDatas_result[0]->tutupan_pohon_percentage,                             'type' => 'string'],
                    "34" => ['table_header' => 'tutupan_pohon_photo',                        'table_new_data' => $getLahanDatas_result[0]->tutupan_pohon_photo,                         'type' => 'string'],
                    "35" => ['table_header' => 'tutupan_tanaman_bawah_percentage',           'table_new_data' => $getLahanDatas_result[0]->tutupan_tanaman_bawah_percentage,                          'type' => 'string'],
                    "36" => ['table_header' => 'tutupan_tanaman_bawah_photo',                'table_new_data' => $getLahanDatas_result[0]->tutupan_tanaman_bawah_photo,                          'type' => 'string'],
                    "37" => ['table_header' => 'tutupan_lain_bangunan_percentage',           'table_new_data' => $getLahanDatas_result[0]->tutupan_lain_bangunan_percentage,                            'type' => 'string'],
                    "38" => ['table_header' => 'tutupan_lain_bangunan_photo',                'table_new_data' => $getLahanDatas_result[0]->tutupan_lain_bangunan_photo,                        'type' => 'string'],
                    "39" => ['table_header' => 'photo1',                                     'table_new_data' => $getLahanDatas_result[0]->photo1,                        'type' => 'string'],
                    
                    "40" => ['table_header' => 'photo2',                                     'table_new_data' => $getLahanDatas_result[0]->photo2,                                   'type' => 'string'],
                    "41" => ['table_header' => 'photo3',                                     'table_new_data' => $getLahanDatas_result[0]->photo3,                             'type' => 'string'],
                    "42" => ['table_header' => 'photo4',                                     'table_new_data' => $getLahanDatas_result[0]->photo4,                         'type' => 'string'],
                    "43" => ['table_header' => 'group_no',                                   'table_new_data' => $getLahanDatas_result[0]->group_no,                          'type' => 'string'],
                    "44" => ['table_header' => 'kelerengan_lahan',                           'table_new_data' => $getLahanDatas_result[0]->kelerengan_lahan,                          'type' => 'string'],
                    "45" => ['table_header' => 'fertilizer',                                 'table_new_data' => $getLahanDatas_result[0]->fertilizer,                            'type' => 'string'],
                    "46" => ['table_header' => 'pesticide',                                  'table_new_data' => $getLahanDatas_result[0]->pesticide,                        'type' => 'string'],
                    "47" => ['table_header' => 'access_to_water_sources',                    'table_new_data' => $getLahanDatas_result[0]->access_to_water_sources,                        'type' => 'string'],
                    
                    "48" => ['table_header' => 'water_availability',                         'table_new_data' => $getLahanDatas_result[0]->water_availability,                                   'type' => 'string'],
                    "49" => ['table_header' => 'water_availability_level',                   'table_new_data' => $getLahanDatas_result[0]->water_availability_level,                             'type' => 'string'],
                    "50" => ['table_header' => 'access_to_lahan',                            'table_new_data' => $getLahanDatas_result[0]->access_to_lahan,                         'type' => 'string'],
                    "51" => ['table_header' => 'potency',                                    'table_new_data' => $getLahanDatas_result[0]->potency,                          'type' => 'string'],
                    "52" => ['table_header' => 'barcode',                                    'table_new_data' => $getLahanDatas_result[0]->barcode,                          'type' => 'string'],
                    "53" => ['table_header' => 'lahan_type',                                 'table_new_data' => $getLahanDatas_result[0]->lahan_type,                            'type' => 'string'],
                    "54" => ['table_header' => 'jarak_lahan',                                'table_new_data' => $getLahanDatas_result[0]->jarak_lahan,                        'type' => 'string'],
                    "56" => ['table_header' => 'exposure',                                   'table_new_data' => $getLahanDatas_result[0]->exposure,                        'type' => 'string'],
                    
                    "57" => ['table_header' => 'opsi_pola_tanam',                        'table_new_data' => $getLahanDatas_result[0]->opsi_pola_tanam,                                   'type' => 'string'],
                    "58" => ['table_header' => 'pohon_kayu',                             'table_new_data' => $getLahanDatas_result[0]->pohon_kayu,                             'type' => 'string'],
                    "59" => ['table_header' => 'pohon_mpts',                             'table_new_data' => $getLahanDatas_result[0]->pohon_mpts,                         'type' => 'string'],
                    "60" => ['table_header' => 'tanaman_bawah',                          'table_new_data' => $getLahanDatas_result[0]->tanaman_bawah,                          'type' => 'string'],
                    "61" => ['table_header' => 'type_sppt',                              'table_new_data' => $getLahanDatas_result[0]->type_sppt,                          'type' => 'string'],
                    "62" => ['table_header' => 'is_dell',                                'table_new_data' => $getLahanDatas_result[0]->is_dell,                            'type' => 'string'],
                    "63" => ['table_header' => 'complete_data',                          'table_new_data' => $getLahanDatas_result[0]->complete_data,                        'type' => 'string'],
                    "64" => ['table_header' => 'fc_complete_data',                       'table_new_data' => $getLahanDatas_result[0]->fc_complete_data,                        'type' => 'string'],
                    
                    "65" => ['table_header' => 'fc_complete_data_at',                    'table_new_data' => $getLahanDatas_result[0]->fc_complete_data_at,                                   'type' => 'string'],
                    "66" => ['table_header' => 'fc_complete_data_by',                    'table_new_data' => $getLahanDatas_result[0]->fc_complete_data_by,                             'type' => 'string'],
                    "67" => ['table_header' => 'approve',                                'table_new_data' => $getLahanDatas_result[0]->approve,                         'type' => 'string'],
                    "68" => ['table_header' => 'approved_by',                            'table_new_data' => $getLahanDatas_result[0]->approved_by,                          'type' => 'string'],
                    "69" => ['table_header' => 'approved_at',                            'table_new_data' => $getLahanDatas_result[0]->approved_at,                          'type' => 'string'],
                    "70" => ['table_header' => 'eligible_status',                        'table_new_data' => $getLahanDatas_result[0]->eligible_status,                            'type' => 'string'],
                    "71" => ['table_header' => 'update_eligible_at',                     'table_new_data' => $getLahanDatas_result[0]->update_eligible_at,                        'type' => 'string'],
                    "72" => ['table_header' => 'update_eligible_by',                     'table_new_data' => $getLahanDatas_result[0]->update_eligible_by,                        'type' => 'string'],
                    
                    "73" => ['table_header' => 'force_majeure_description',              'table_new_data' => $getLahanDatas_result[0]->force_majeure_description,                                   'type' => 'string'],
                    "74" => ['table_header' => 'floods',                                 'table_new_data' => $getLahanDatas_result[0]->floods,                             'type' => 'string'],
                    "75" => ['table_header' => 'wildfire',                               'table_new_data' => $getLahanDatas_result[0]->wildfire,                         'type' => 'string'],
                    "76" => ['table_header' => 'landslide',                              'table_new_data' => $getLahanDatas_result[0]->landslide,                          'type' => 'string'],
                    "77" => ['table_header' => 'drought',                                'table_new_data' => $getLahanDatas_result[0]->drought,                          'type' => 'string'],
                    "78" => ['table_header' => 'animal_protected_habitat',               'table_new_data' => $getLahanDatas_result[0]->animal_protected_habitat,                            'type' => 'string'],
                    "79" => ['table_header' => 'animal_protected_habitat_distance',      'table_new_data' => $getLahanDatas_result[0]->animal_protected_habitat_distance,                        'type' => 'string'],
                    "80" => ['table_header' => 'latest_condition',                       'table_new_data' => $getLahanDatas_result[0]->latest_condition,                        'type' => 'string'],
                    
                    "81" => ['table_header' => 'polygon_from_ff',                        'table_new_data' => $getLahanDatas_result[0]->polygon_from_ff,                                   'type' => 'string'],
                    "82" => ['table_header' => 'polygon_from_gis',                       'table_new_data' => $getLahanDatas_result[0]->polygon_from_gis,                             'type' => 'string'],
                    "83" => ['table_header' => 'gis_polygon_area',                       'table_new_data' => $getLahanDatas_result[0]->gis_polygon_area,                         'type' => 'string'],
                    "84" => ['table_header' => 'updated_gis',                            'table_new_data' => $getLahanDatas_result[0]->updated_gis,                          'type' => 'string'],
                    "85" => ['table_header' => 'gis_updated_at',                         'table_new_data' => $getLahanDatas_result[0]->gis_updated_at,                          'type' => 'string'],
                    "86" => ['table_header' => 'gis_officer',                            'table_new_data' => $getLahanDatas_result[0]->gis_officer,                            'type' => 'string'],
                    "87" => ['table_header' => 'gps_accuration',                         'table_new_data' => $getLahanDatas_result[0]->gps_accuration,                        'type' => 'string'],
                    "88" => ['table_header' => 'status',                                 'table_new_data' => $getLahanDatas_result[0]->status,                        'type' => 'string'],
                    
                    "89" => ['table_header' => 'status_perubahan_tutupan',               'table_new_data' => $getLahanDatas_result[0]->status_perubahan_tutupan,                                   'type' => 'string'],
                    "90" => ['table_header' => 'plant_status',                           'table_new_data' => $getLahanDatas_result[0]->plant_status,                             'type' => 'string'],
                    "91" => ['table_header' => 'seed_is_modified',                       'table_new_data' => $getLahanDatas_result[0]->seed_is_modified,                         'type' => 'string'],
                    "92" => ['table_header' => 'seed_verify_status',                     'table_new_data' => $getLahanDatas_result[0]->seed_verify_status,                          'type' => 'string'],
                    "93" => ['table_header' => 'is_assigned_by',                         'table_new_data' => $request->user_id,                          'type' => 'string'],
                    "94" => ['table_header' => 'gis_planting_area',                      'table_new_data' => $getLahanDatas_result[0]->gis_planting_area,                         'type' => 'string'],
                    ];
                        
                    $mainLogdatas =  $this->dynamicCreate([
                                'tableName' => 'log_lahans',
                                'inputData' => $createDatas,
                            ]);
                    $LogMainLahanresult = DB::insert($mainLogdatas);
                
                //Update Main Lahan    
                $updateMainLahan = [ 
                    "0" => ['table_header' => 'approve',                'table_new_data' => '0',         'type' => 'string'],
                    ];
                        
                    $MainDatasLahan =  $this->dynamicUpdate([
                                'current_id' => $request->lahan_no,
                                'tableName' => "lahans",
                                'inputData' => $updateMainLahan,
                                'other_id_index' => 'lahan_no',
                                'id_data_type' => 'string'
                            ]);
                $MainDatasLahan_res = DB::update($MainDatasLahan);
                //Detail Lahans
                //log
                $getLahanDatas = $this->DynamicDetail([
                    'sourceColumn' => 'lahan_no',
                    'id_type' => 'string',
                    'detail_id' => $request->lahan_no,
                    'tableName' => 'lahan_details',
                    'tableAlias' => 'A',
                    'field' => ['*'],
                    'relation' => [],
                    'req' => $request
                ]);
                $getLahanDatas_result = DB::select($getLahanDatas);
                if(count($getLahanDatas_result)> 0){
                    foreach($getLahanDatas_result as $detail){
                        $createLogDetailDatas = [
                            "1" => ['table_header' => 'lahan_no',                   'table_new_data' => $detail->lahan_no,                             'type' => 'string'],
                            "2" => ['table_header' => 'tree_code',               'table_new_data' => $detail->tree_code,                         'type' => 'string'],
                            "3" => ['table_header' => 'amount',                'table_new_data' => $detail->amount,                          'type' => 'string'],
                            "4" => ['table_header' => 'detail_year',              'table_new_data' => $detail->detail_year,                          'type' => 'string'],
                            "5" => ['table_header' => 'user_id',                  'table_new_data' => $detail->user_id,                            'type' => 'string'],
                            "4" => ['table_header' => 'created_at',              'table_new_data' => $detail->created_at,                          'type' => 'string'],
                            "5" => ['table_header' => 'updated_at',                  'table_new_data' => $detail->updated_at,                            'type' => 'string'],
                        ];
                        $createLogDetailDatas_query = $this->dynamicCreate([
                                'tableName' => 'log_lahan_details',
                                'inputData' => $createLogDetailDatas,
                            ]);
                        $createLogDetailDatas_result = DB::insert($createLogDetailDatas_query);
                    }
                }
                //main
                $updateDetailLahans = [ 
                    "0" => ['table_header' => 'amount',                     'table_new_data' => '0',                'type' => 'string'],
                    "1" => ['table_header' => 'detail_year',                'table_new_data' => date("Y-m-d"),      'type' => 'string'],
                ];
                        
                    $DetailDatasLahan =  $this->dynamicUpdate([
                        'current_id' => $request->lahan_no,
                        'tableName' => "lahan_details",
                        'inputData' => $updateDetailLahans,
                        'other_id_index' => 'lahan_no',
                        'id_data_type' => 'string'
                    ]);
                $DetailLahanDatas_res = DB::update($DetailDatasLahan);
                
                
                
                    
                return response()->json([
                    'log_main_lahan_result' => $LogMainLahanresult,
                    'update_main_lahan_result' => $MainDatasLahan_res,
                    'create_log_detail_lahan_result' => $createLogDetailDatas_result ?? 'Data Detail Tidak Ditemukan!',
                    'update_main_lahan_details_result' => $DetailLahanDatas_res
                    
                    
                ]);
            }else{
                return response()->json(['message' => 'Data Tidak Bisa Assign Data Lahan Karena Belum Di-Approve!']);
            }
        }
    }
    
    
    public function DeleteDataLahan_new(Request $request){
        $validator = Validator::make($request -> all(), [
            'lahan_no' => 'required',
            'delete_type' => 'required' // soft_delete | hard_delete
            ]);
            if($validator->fails()){
                $rslt =  $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
                return response()->json($rslt, 400);
            }else{
                if($request->delete_type == 'soft_delete'){
                    // $deleteColumn = [
                    //         "0" => ['table_header' => 'is_del',            'table_new_data' => '1',                         'type' => 'string'],
                    //         "1" => ['table_header' => 'updated_at',                 'table_new_data' => Carbon::now()]
                    //     ];
                    // $formMinatMainQuery =  $this->DynamicUpdate([
                    //         'current_id' => $request->form_no,
                    //         'tableName' => 'lahans',
                    //         'inputData' => $deleteColumn,
                    //         'other_id_index' => 'form_no',
                    //         'id_data_type' => 'string'
                    //     ]);
                    // $formMinatFarmersQuery =  $this->DynamicUpdate([
                    //         'current_id' => $request->form_no,
                    //         'tableName' => 'form_minat_farmers',
                    //         'inputData' => $deleteColumn,
                    //         'other_id_index' => 'form_no',
                    //         'id_data_type' => 'string'
                    //     ]);
                        
                        
                    // $formMinatResult = DB::update($formMinatMainQuery);
                    // $formMinatFarmerResult = DB::update($formMinatFarmersQuery);
                    
                        return response()->json('Soft Delete Belum Siap :), Silahkan gunakan Hard delete dengan berhati-hati..', 200);
                    
                }else if($request->delete_type == 'hard_delete'){
                        $mainLahanQuery = $this->DynamicDelete([
                            'current_id' => $request->lahan_no,
                            'tableName' => 'lahans',
                            'other_id_index' => 'lahan_no',
                            'index_data_type' => 'string'
                        ]);
                        $lahanBarcodeRequestQuery = $this->DynamicDelete([
                            'current_id' => $request->lahan_no,
                            'tableName' => 'lahan_barcode_requests',
                            'other_id_index' => 'lahan_no',
                            'index_data_type' => 'string'
                        ]);
                        $lahanDetailQuery = $this->DynamicDelete([
                            'current_id' => $request->lahan_no,
                            'tableName' => 'lahan_details',
                            'other_id_index' => 'lahan_no',
                            'index_data_type' => 'string',
                            // 'condition' => $mainPivotsCondition
                        ]);
                        $lahanDeviceQuery = $this->DynamicDelete([
                            'current_id' => $request->lahan_no,
                            'tableName' => 'lahan_ff_devices',
                            'other_id_index' => 'lahan_no',
                            'index_data_type' => 'string'
                        ]);
                        $lahanPolygonsQuery = $this->DynamicDelete([
                            'current_id' => $request->lahan_no,
                            'tableName' => 'lahan_polygons',
                            'other_id_index' => 'lahan_no',
                            'index_data_type' => 'string'
                        ]);
                        $lahanProjectQuery = $this->DynamicDelete([
                            'current_id' => $request->lahan_no,
                            'tableName' => 'lahan_projects',
                            'other_id_index' => 'lahan_no',
                            'index_data_type' => 'string',
                            // 'condition' => $mainPivotsCondition
                        ]);
                        $lahanProjectTermQuery = $this->DynamicDelete([
                            'current_id' => $request->lahan_no,
                            'tableName' => 'lahan_project_terms',
                            'other_id_index' => 'lahan_no',
                            'index_data_type' => 'string'
                        ]);
                        $lahanTutupanQuery = $this->DynamicDelete([
                            'current_id' => $request->lahan_no,
                            'tableName' => 'lahan_tutupans',
                            'other_id_index' => 'lahan_no',
                            'index_data_type' => 'string',
                            // 'condition' => $mainPivotsCondition
                        ]);
                    
                    $mainResult = DB::delete($mainLahanQuery);
                    $barcodeRequestResult = DB::delete($lahanBarcodeRequestQuery);
                    $detailResult = DB::delete($lahanDetailQuery);
                    $deviceResult = DB::delete($lahanDeviceQuery);
                    $polygonResult = DB::delete($lahanPolygonsQuery);
                    $projectResult = DB::delete($lahanProjectQuery);
                    $projectTermResult = DB::delete($lahanProjectTermQuery);
                    $tutupanResult = DB::delete($lahanTutupanQuery);
                    
                    return response()->json([
                        'main_result' => $mainResult,
                        'barcode_request_result' => $barcodeRequestResult,
                        'detail_result' => $detailResult,
                        'device_result' => $deviceResult,
                        'polygon_result' => $polygonResult,
                        'project_result' => $projectResult,
                        'project_term_result' => $projectTermResult,
                        'tutupan_result' => $tutupanResult,
                        ], 200);
                    
                }else{
                    return response()->json('Silahkan input tipe delete yang valid :)', 400);
                }
            }
    }
    
    /**
     * @SWG\Get(
     *   path="/api/GetLahanAllAdmin",
     *   tags={"Lahan"},
     *   security={
	 *     {"apiAuth": {}},
	 *   },
     *   summary="Get Lahan All Admin",
     *   operationId="GetLahanAllAdmin",
     *   @SWG\Response(response=200, description="successful operation"),
     *   @SWG\Response(response=401, description="Unauthenticated"),
     *   @SWG\Response(response=500, description="internal server error"),
     *      @SWG\Parameter(name="typegetdata",in="query", type="string"),
     *      @SWG\Parameter(name="ff",in="query", type="string"),
     *      @SWG\Parameter(name="mu",in="query",  type="string"),
     *      @SWG\Parameter(name="ta",in="query", type="string"),
     *      @SWG\Parameter(name="village",in="query",  type="string"),
     * )
     */
    public function GetLahanAllAdmin(Request $request){
        $typegetdata = $request->typegetdata;
        $ff = $request->ff;
        $py = $request->program_year;
        $per_page = $request->per_page;
        $mu = $request->mu;
        $ta = $request->ta;
        $village = $request->village;
        
        $updateMode = $request->update_mode;
        
        if ($per_page > 500) {
            $per_page = 500;
        }
        
        if ($ff) {
            $ff = explode(',', $ff);
        } else $ff = [];
        $filtered = false;
        $filter_lahan_no = [];
        
        if ($mu || $ta || $village) {
            $ff_wa = DB::table('ff_working_areas')
                ->where([
                    ['program_year', 'LIKE', "%$py%"],
                ]);
            if ($mu) $ff_wa = $ff_wa->where('mu_no', $mu);
            if ($ta) $ff_wa = $ff_wa->where('area_code', $ta);
            if ($village) $ff_wa = $ff_wa->where('kode_desa', $village);
            if (count($ff) > 0) {
                $ff_wa = $ff_wa->whereIn('ff_no', $ff);
            }
            
            $ff = $ff_wa->pluck('ff_no')->toArray();
            $filtered = true;
        }
        
        if (count($ff) > 0) {
            $farmer_no = DB::table('main_pivots')
                ->where([
                    'type' => 'ff_farmer',
                    ['program_year', 'LIKE', "%$py%"]    
                ])->whereIn('key1', $ff)->pluck('key2')->toArray();
            $filter_lahan_no = DB::table('main_pivots')
                ->where([
                    'type' => 'farmer_lahan',
                    ['program_year', 'LIKE', "%$py%"]    
                ])->whereIn('key1', $farmer_no)->pluck('key2')->toArray();
            $filtered = true;
        }
        
        
        $lahans = DB::table('lahans')->select('lahans.id', 
                'lahans.lahan_no',
                'lahans.longitude', 
                'lahans.user_id', 
                'lahans.user_id as ff_code', 
                'lahans.latitude',
                'lahans.coordinate',
                'lahans.lahan_type',
                'farmers.farmer_no as farmer_no', 
                'farmers.ktp_no as farmer_nik', 
                'farmers.name as farmer_name',
                'desas.name as village_name',
                'lahans.document_no', 
                'lahans.complete_data', 
                'lahans.approve', 
                'lahans.updated_gis', 
                'lahans.is_dell', 
                'lahans.created_at', 
                'lahans.created_time',
                'lahans.pohon_kayu', 
                'lahans.pohon_mpts',
                'lahans.mu_no',
                'lahans.target_area',
                'lahans.latest_condition',
                //'lahan_tutupans.program_year',
                'lahan_tutupans.tutupan_lahan',
                'lahan_tutupans.land_area',
                'lahans.gis_polygon_area',
                'lahans.gis_planting_area',
                'lahan_tutupans.pattern as opsi_pola_tanam'
            )
            ->join('farmers', 'farmers.farmer_no', '=', 'lahans.farmer_no')
            ->join('desas', 'desas.kode_desa', '=', 'lahans.village')
            ->join('lahan_tutupans', 'lahan_tutupans.lahan_no', '=', 'lahans.lahan_no')->where('lahans.is_dell',0);
        
        
        $lahans = $lahans->where([
                ['lahan_tutupans.program_year','like',"%$py%"]
            ]);
        if (count($filter_lahan_no) > 0 || $filtered === true) {
            $lahans = $lahans->whereIn('lahans.lahan_no', $filter_lahan_no);
        }
        if ($updateMode){
            $lahans = $lahans->where('lahans.project_no', '=', '-');
        }
            
        // search
        $Scolumn = $request->search_column;
        $Svalue = $request->search_value;
        if ($Scolumn && $Svalue) {
            $Ncolumn = '';
            $type = 'LIKE';
            if ($Scolumn == 'farmer_no') $Ncolumn = 'farmers.farmer_no';
            if ($Scolumn == 'farmer_name') $Ncolumn = 'farmers.name';
            if ($Scolumn == 'lahan_no') $Ncolumn = 'lahans.lahan_no';
            if ($Scolumn == 'village_name') $Ncolumn = 'desas.name';
            if ($Scolumn == 'farmer_nik') $Ncolumn = 'farmers.ktp_no';
            if ($Scolumn == 'opsi_pola_tanam') {
                $type = '=';
                $Ncolumn = 'lahan_tutupans.pattern';
            }
            if ($type == 'LIKE') $Svalue = "%$Svalue%";
            if ($Ncolumn && $Svalue) {
                $lahans = $lahans->where($Ncolumn, $type, "$Svalue");
                $ff_no_search = $lahans->pluck('lahans.user_id')->toArray();
            }
            
            if ($Scolumn == 'ff_name' && $Svalue) {
                $searchQuery = DB::table('main_pivots')->where([
                    'type' => 'ff_farmer',
                    ['program_year', 'LIKE', "%$py%" ],
                ])->join('field_facilitators', 'field_facilitators.ff_no', 'main_pivots.key1')
                ->where([
                    ['field_facilitators.name', 'LIKE', "%$Svalue%"]
                ]);
                
                $ff_no_search = $searchQuery->pluck('key1')->toArray();
                $farmer_no_search = $searchQuery->pluck('key2')->toArray();
                
                $lahans = $lahans->whereIn('farmers.farmer_no', $farmer_no_search);
            }
        }
        
        // sorting data
        if ($request->sortBy) {
            $sorting = explode(',',$request->sortBy);
            $desc = explode(',',$request->sortDesc);
            foreach ($sorting as $sortIndex => $sort) {
                $lahans = $lahans->orderBy($sort, $desc[$sortIndex] == 'true' ? 'DESC' : 'ASC');
            }
        }
        
        // filtered status
        if ($status = $request->status) {
            if ($status == 'Terverifikasi') {
                $lahans = $lahans->where('lahans.approve', 1);
            }
            if ($status == 'Belum Lengkap') {
                $lahans = $lahans->where('lahans.complete_data', 0);
            }
            if ($status == 'Belum Verifikasi') {
                $lahans = $lahans->where([
                    'lahans.approve' => 0,
                    'lahans.complete_data' => 1
                ]);
            }
            $ff_no_status = $lahans->pluck('lahans.user_id')->toArray();
        }
        
        // get lahan count
        $lahans_no_all = $lahans->pluck('lahans.lahan_no')->toArray();
        $farmer_no_all = $lahans->pluck('farmers.farmer_no')->toArray();
        $lahanTotal = count($lahans_no_all);
        $lahanBelumLengkap = DB::table('lahans')->whereIn('lahan_no', $lahans_no_all)->where('complete_data', 0)->count();
        $lahanBelumVerifikasi = DB::table('lahans')->whereIn('lahan_no', $lahans_no_all)->where([
                'lahans.approve' => 0,
                'lahans.complete_data' => 1
            ])->count();
        $lahanTerverifikasi = DB::table('lahans')->whereIn('lahan_no', $lahans_no_all)->where('lahans.approve', 1)->count();
        // query petani belum ada data lahan
        $petaniSudahAdaLahan = DB::table('main_pivots')
        ->where([
            'type' => 'farmer_lahan',
            ['program_year', 'LIKE', "%$py%"]
            ])->pluck('key1')->toArray();
        $petaniBelumAdaLahan = DB::table('main_pivots')
            ->where([
                'type' => 'ff_farmer',
                ['program_year', 'LIKE', "%$py%"]
            ])
            ->whereNotIn('key2', $petaniSudahAdaLahan);
        if (count($ff) > 0) {
            $petaniBelumAdaLahan = $petaniBelumAdaLahan->whereIn('key1', $ff);
        }
        if (isset($ff_no_search)) {
            $petaniBelumAdaLahan = $petaniBelumAdaLahan->whereIn('key1', $ff_no_search);
        }
        if(isset($ff_no_status)){
            $petaniBelumAdaLahan = $petaniBelumAdaLahan->whereIn('key1', $ff_no_status);
        }
        $petaniBelumAdaLahan = $petaniBelumAdaLahan
            ->groupBy('key2')->get();
        
        $lahans = $lahans->paginate($per_page);
        
        foreach ($lahans as $lahan) {
            // field facilitator
            $ff_no = DB::table('main_pivots')->where([
                    'type' => 'ff_farmer',
                    'key2' => $lahan->farmer_no,
                    ['program_year', 'LIKE', "%$py%" ],
                ])->first()->key1 ?? '';
            $ff_data = DB::table('field_facilitators')->where('ff_no', $ff_no)->first();
            $lahan->ff_name = $ff_data->name ?? '';
        
            // get seed type
            $lahan->jenis_bibit = DB::table('lahan_details')->join('trees', 'trees.tree_code', 'lahan_details.tree_code')
            ->where([
                'lahan_details.lahan_no' => $lahan->lahan_no,
            ])->whereYear('lahan_details.detail_year', $py)->pluck('trees.tree_name')->toArray();
            // $lahan_create_at = DB::table('lahans')->join('main_pivot', 'main_pivot.key2')->whereYear('')
        }
        
        $rslt =  [
            'total' => $lahanTotal ?? 0,
            'belum_ada' => $petaniBelumAdaLahan ? count($petaniBelumAdaLahan) : 0,
            'belum_lengkap' => $lahanBelumLengkap ?? 0,
            'belum_verifikasi' => $lahanBelumVerifikasi ?? 0,
            'terverifikasi' => $lahanTerverifikasi ?? 0,
            'lahan' => $lahans,
        ];
        return response()->json($rslt, 200); 
    }
    
    public function addLahanFromWeb(Request $request){
        $validator = Validator::make($request->all(), [
            'lahan_no' => 'required',
            'document_no' => 'required',
            'land_area' => 'required',
            'planting_area' => 'required',
            'longitude' => 'required',
            'latitude' => 'required',
            'coordinate' => 'required',
            'polygon' => 'required',
            'village' => 'required',
            'kecamatan' => 'required',
            'city' => 'required',
            'province' => 'required',
            'description' => 'required',
            'elevation' => 'required',
            'soil_type' => 'required',
            'active'  => 'required',
            'farmer_no'  => 'required',
            'mu_no'  => 'required',
            'target_area'  => 'required',
            'user_id'  => 'required',
            'sppt' => 'required',
            'tutupan_lahan'  => 'required',
            'photo1' => 'required',
            'photo2' => 'required',
            'photo3' => 'required',
            'photo4' => 'required',
            'kelerengan_lahan' => 'required',
            'fertilizer' => 'required',
            'pesticide' => 'required',
            'access_to_water_source' => 'required',
            'water_availability' => 'required',
            'access_to_lahan' => 'required',
            'potency' => 'required',
            'lahan_type' => 'required',
            'jarak_lahan' => 'required',
            'opsi_pola_tanam' => 'required',
            'pohon_kayu' => 'required',
            'pohon_mpts' => 'required',
            'updated_gis' => 'required',
            'plant_status' => 'required',
            ]);
        if($validator->fails()){
            $rslt =  $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        }
        
        $lahan_no = Lahan::Maxno();
        $time = Carbon::now();
        
        // upload photo
        if(isset($request->photo1)){
            $foto1 = $this->UploadPhotoExternal($request->photo4, ('Uploads/Lahan1_'.$lahan_no));
        }
        if(isset($request->photo2)){
            $foto2 = $this->UploadPhotoExternal($request->photo2, ('Uploads/Lahan2_'.$lahan_no));
        }
        if(isset($request->photo3)){
            $foto3 = $this->UploadPhotoExternal($request->photo3, ('Uploads/Lahan3_'.$lahan_no));
        }
        if(isset($request->photo4)){
            $foto4 = $this->UploadPhotoExternal($request->photo4, ('Uploads/Lahan4_'.$lahan_no));
        }
        if(isset($request->sppt)){
            $fotoSppt = $this->UploadPhotoExternal($request->sppt, ('sppt-photos/,'.$lahan_no.'_sppt'));
        }
        Lahan::create([
            'lahan_no' => $lahan_no,
            'document_no' => $document_no,
            'land_area' => $land_area,
            'planting_area' => $planting_area,
            'longitude' => $longitude,
            'latitude' => $latitude,
            'coordinate' => $coordinate,
            'polygon' => $polygon,
            'village' => $village,
            'kecamatan' => $kecamatan,
            'city' => $city,
            'province' => $province,
            'description' => $description,
            'elevation' => $elevation,
            'soil_type' => $soil_type,
            'active'  => $active,
            'farmer_no'  => $farmer_no,
            'mu_no'  => $mu_no,
            'target_area'  => $target_area,
            'user_id'  => $user_id,
            'sppt' => $fotoSppt,
            'tutupan_lahan'  => $tutupan_lahan,
            'photo1' => $foto1,
            'photo2' => $foto2,
            'photo3' => $foto3,
            'photo4' => $foto4,
            'kelerengan_lahan' => $kelerengan_lahan,
            'fertilizer' => $fertilizer,
            'pesticide' => $pesticide,
            'access_to_water_source' => $access_to_water_source,
            'water_availability' => $water_availability,
            'access_to_lahan' => $access_to_lahan,
            'potency' => $potency,
            'lahan_type' => $lahan_type,
            'jarak_lahan' => $jarak_lahan,
            'opsi_pola_tanam' => $opsi_pola_tanam,
            'pohon_kayu' => $pohon_kayu,
            'pohon_mpts' => $pohon_mpts,
            'updated_gis' => $updated_gis,
            'plant_status' => $plant_status,
            
            'created_at'=>$time,
            'updated_at'=>$time,
            ]);
            
        $rslt =  $this->ResultReturn(200, 'success', 'Berhasil menambahkan data Lahan.');
        return response()->json($rslt, 200);
    }
    
    public function GetLahanAllAdminNew(Request $request){
        // validation
        $validator = Validator::make($request->all(), [
            'program_year' => 'required',
            'per_page' => 'required'
        ]);

        if($validator->fails()){
            $rslt =  $this->ResultReturn(400, $validator->errors(), $validator->errors());
            return response()->json($rslt, 400);
        } else {
            $py = $request->program_year;
            $per_page = $request->per_page;
        }
        $typegetdata = $request->typegetdata;
        $ff = $request->ff;
        $py = $request->program_year;
        $getmu = $request->mu;
        $getta = $request->ta;
        $getvillage = $request->village;
        if($getmu){$mu='%'.$getmu.'%';}
        else{$mu='%%';}
        if($getta){$ta='%'.$getta.'%';}
        else{$ta='%%';}
        if($getvillage){$village='%'.$getvillage.'%';}
        else{$village='%%';}
            
        $GetLahanAll = DB::table('lahans')
            ->select('lahans.id as id_lahan', 
            'lahans.lahan_no as lahan_no',
            'lahans.longitude', 
            'lahans.latitude',
            'lahans.coordinate',
            'lahans.lahan_type', 
            'farmers.farmer_no as farmer_no', 
            'farmers.ktp_no as farmer_nik', 
            'farmers.name as farmer_name',
            'desas.name as village_name',
            'field_facilitators.name as ff_name',
            'lahans.document_no', 
            'lahans.complete_data', 
            'lahans.approve', 
            'lahans.updated_gis', 
            'lahans.is_dell', 
            'lahans.created_at', 
            'lahans.created_time', 
            'lahan_tutupans.tutupan_lahan', 
            'lahans.pohon_kayu', 
            'lahans.pohon_mpts', 
            'lahan_tutupans.land_area', 
            'lahan_tutupans.pattern as opsi_pola_tanam')
            ->join('farmers', 'farmers.farmer_no', '=', 'lahans.farmer_no')
            ->join('field_facilitators', 'field_facilitators.ff_no', '=', 'lahans.user_id')
            ->join('desas', 'desas.kode_desa', '=', 'lahans.village')
            ->join('lahan_tutupans', 'lahan_tutupans.lahan_no', '=', 'lahans.lahan_no')
            ->where('lahans.is_dell','=',0)
            ->where('lahans.mu_no','like',$mu)
            ->where('lahans.target_area','like',$ta)
            ->where('lahans.village','like',$village)
            ->where('lahan_tutupans.program_year','like',$py);
        
        $userNIK = Auth::user()->employee_no;
        $positionNo = (string)Employee::where('nik', $userNIK)->first()->position_no ?? '0';
        $ITPositions = DB::table('employee_positions')->where('position_group', 'IT')->pluck('position_no')->toArray();
        if (in_array($positionNo, $ITPositions) == false) $GetLahanAll = $GetLahanAll->where('lahans.user_id', 'LIKE', 'FF%');
            
        if ($py) {
            // if($py > 2022){
            // $GetLahanAll = $GetLahanAll
            //     ->whereYear('lahans.created_time', $py);    
            // }else{
            $GetLahanAll = $GetLahanAll
                ->join('main_pivots', 'main_pivots.key2', '=', 'lahans.lahan_no')
                ->where('main_pivots.type', '=', 'farmer_lahan')
                ->where('main_pivots.program_year', 'like', "%$py%");
            // }
        }
            
        if($ff){
            $ffdecode = $this->getFFListByUserPY($py);
            $GetLahanAll = $GetLahanAll
            ->wherein('lahans.user_id',$ffdecode);
        }
            
        // search
        if ($request->search_column && $request->search_value) {
            $Scolumn = $request->search_column;
            $type = 'LIKE';
            $Svalue = $request->search_value;
            if ($Scolumn == 'ff_name') $Scolumn = 'field_facilitators.name';
            if ($Scolumn == 'farmer_no') $Scolumn = 'farmers.farmer_no';
            if ($Scolumn == 'farmer_name') $Scolumn = 'farmers.name';
            if ($Scolumn == 'lahan_no') $Scolumn = 'lahans.lahan_no';
            if ($Scolumn == 'village_name') $Scolumn = 'desas.name';
            if ($Scolumn == 'farmer_nik') $Scolumn = 'farmers.ktp_no';
            if ($Scolumn == 'opsi_pola_tanam') {
                $type = '=';
                $Scolumn = 'lahan_tutupans.pattern';
            }
            
            if ($type == 'LIKE') $Svalue = "%$Svalue%";
            $GetLahanAll = $GetLahanAll->where($Scolumn, $type, "$Svalue");
        }
        // sorting data
        if ($request->sortBy) {
            $sorting = explode(',',$request->sortBy);
            $desc = explode(',',$request->sortDesc);
            foreach ($sorting as $sortIndex => $sort) {
                $GetLahanAll = $GetLahanAll->orderBy($sort, $desc[$sortIndex] == 'true' ? 'DESC' : 'ASC');
            }
        }
        // tester data
        if ($request->tester_data == '0') {
            $GetLahanAll = $GetLahanAll->where([
                ['field_facilitators.ff_no', 'LIKE', 'FF%'],
                ['field_facilitators.name', 'NOT LIKE', '%FF%'],
                ['lahans.lahan_no', 'LIKE', '10_0%']
            ]);
        }
        // filtered status
        if ($status = $request->status) {
            if ($status == 'Terverifikasi') {
                $GetLahanAll = $GetLahanAll->where('lahans.approve', 1);
            }
            if ($status == 'Belum Lengkap') {
                $GetLahanAll = $GetLahanAll->where('lahans.complete_data', 0);
            }
            if ($status == 'Belum Verifikasi') {
                $GetLahanAll = $GetLahanAll->where([
                    'lahans.approve' => 0,
                    'lahans.complete_data' => 1
                ]);
            }
        }

        $GetLahanAll = $GetLahanAll->orderBy('lahans.created_at', 'desc')->groupBy('lahans.lahan_no')->paginate($per_page);
        
        foreach ($GetLahanAll as $data) {
            $data->jenis_bibit = DB::table('lahan_details')->join('trees', 'trees.tree_code', 'lahan_details.tree_code')
            ->where([
                'lahan_details.lahan_no' => $data->lahan_no,
            ])->whereYear('lahan_details.detail_year', $py)->pluck('trees.tree_name')->toArray();
        }

        if(count($GetLahanAll)!=0){ 
            $rslt =  $this->ResultReturn(200, 'success', $GetLahanAll);
            return response()->json($rslt, 200);  
        }
        else{
            $rslt =  $this->ResultReturn(404, 'doesnt match data', 'doesnt match data');
            return response()->json($rslt, 404);
        }
    }
    
    public function GetLahanAllAdminView(Request $request){
        $typegetdata = $request->typegetdata;
        $ff = $request->ff;
        $py = $request->program_year;
        $getmu = $request->mu;
        $getta = $request->ta;
        $getvillage = $request->village;
        if($getmu){$mu='%'.$getmu.'%';}
        else{$mu='%%';}
        if($getta){$ta='%'.$getta.'%';}
        else{$ta='%%';}
        if($getvillage){$village='%'.$getvillage.'%';}
        else{$village='%%';}
            
        $GetLahanAll = DB::table('lahans')
            ->select('lahans.id as id_lahan', 
            'lahans.lahan_no as lahan_no',
            'lahans.longitude', 
            'lahans.latitude',
            'lahans.coordinate',
            'lahans.lahan_type', 
            'farmers.farmer_no as farmer_no', 
            'farmers.ktp_no as farmer_nik', 
            'farmers.name as farmer_name',
            'desas.name as village_name',
            'field_facilitators.name as ff_name',
            'lahans.document_no', 
            'lahans.complete_data', 
            'lahans.approve', 
            'lahans.updated_gis', 
            'lahans.is_dell', 
            'lahans.created_at', 
            'lahans.created_time', 
            'lahan_tutupans.tutupan_lahan', 
            'lahans.pohon_kayu', 
            'lahans.pohon_mpts', 
            'lahan_tutupans.land_area', 
            'lahan_tutupans.pattern as opsi_pola_tanam')
            ->join('farmers', 'farmers.farmer_no', '=', 'lahans.farmer_no')
            ->join('field_facilitators', 'field_facilitators.ff_no', '=', 'lahans.user_id')
            ->join('desas', 'desas.kode_desa', '=', 'lahans.village')
            ->join('lahan_tutupans', 'lahan_tutupans.lahan_no', '=', 'lahans.lahan_no')
            ->where('lahans.is_dell','=',0)->get();
            // ->where('lahans.mu_no','like',$mu)
            // ->where('lahans.target_area','like',$ta)
            // ->where('lahans.village','like',$village)
            // ->where('lahan_tutupans.program_year','like',$py);
            
        return $GetLahanAll;
        
        if ($py) {
            $GetLahanAll = $GetLahanAll
                ->join('main_pivots', 'main_pivots.key2', '=', 'lahans.lahan_no')
                ->where('main_pivots.type', '=', 'farmer_lahan')
                ->where('main_pivots.program_year', 'like', "%$py%");
            // }
        }
        
        $GetLahanAll = $GetLahanAll->orderBy('lahans.created_at', 'desc')->groupBy('lahans.lahan_no');
        
        if($GetLahanAll){ 
            $rslt =  $this->ResultReturn(200, 'success', $GetLahanAll);
            return response()->json($rslt, 200);  
        }
        else{
            $rslt =  $this->ResultReturn(404, 'doesnt match data', 'doesnt match data');
            return response()->json($rslt, 404);
        }
    }
    
    public function GetLahanFF(Request $request){
        $ff_no = $request->user_id;
        $getpy = $request->created_at;
        // $getfarmerno = $request->farmer_no;
        if($getpy){$py='%'.$getpy.'%';}
        else{$py='%%';}
        // if($getfarmerno){$farmer_no='%'.$getfarmerno.'%';}
        // else{$farmer_no='%%';}
        
        $lahan = Lahan::where('user_id', '=', $ff_no)->where('is_dell', '=', 0)->where('created_at', 'like', $py)->orderBy('id', 'ASC')->get();
        
        if($lahan){
            $lahDetails = [];
            foreach($lahan as $sIndex => $lhn){
                $getFF = DB::table('field_facilitators')->where('ff_no', '=', $lhn->ff_no)->first();
                $getDetailLahan = DB::table('lahan_details')
                ->select('lahan_details.id', 'lahan_details.lahan_no', 'lahan_details.tree_code', 'lahan_details.amount', 'lahan_details.detail_year', 'lahan_details.user_id', 'lahan_details.created_at', 'lahan_details.updated_at', 
                    'tree_locations.tree_name as tree_name', 'tree_locations.category as tree_category', 'tree_locations.mu_no as mu_no')
                ->leftjoin('tree_locations', 'tree_locations.tree_code', '=', 'lahan_details.tree_code')
                ->where([
                    'lahan_no' =>$lhn->lahan_no,
                    'mu_no' => $getFF->mu_no
                ])->get();
                array_push($lahDetails, ...$getDetailLahan);
                $getDetailLahan[$sIndex]->lahan_no = (string)$lhn->lahan_no;
            }
            
            if(count($lahan)!=0){
                foreach ($lahan as $detail) {
                    $detail->main_pivot = MainPivot::where('key2', $detail->lahan_no)->where('type', 'farmer_lahan')->get();
                }
                $rslt =  $this->ResultReturn(200, 'success', $lahan);
                return response()->json($rslt, 200);  
            }
            
            
             $data = [
                'data' => $lahan,
                'lahan_details' => $lahDetails
            ];
        }
        
        $rslt = $this->ResultReturn(200, 'success', $data);
        return response()->json($rslt, 200);
    }

    public function ExportLahanAllAdmin(Request $request){
        $typegetdata = $request->typegetdata;
        $py = $request->program_year ?? date('Y');
        $ff = $request->ff;
        $getmu = $request->mu;
        $getta = $request->ta;
        $getvillage = $request->village;
        if($getmu){$mu='%'.$getmu.'%';}
        else{$mu='%%';}
        if($getta){$ta='%'.$getta.'%';}
        else{$ta='%%';}
        if($getvillage){$village='%'.$getvillage.'%';}
        else{$village='%%';}
        
        try{                    
            if($typegetdata == 'all' || $typegetdata == 'several'){
                $GetLahanAll = DB::table('lahans')
                ->select(
                    'lahans.id as idTblLahan',
                    'lahans.lahan_no as lahanNo',
                    'lahans.longitude',
                    'lahans.latitude',
                    'lahans.coordinate',
                    'lahans.pohon_kayu',
                    'lahans.pohon_mpts',
                    'lahans.land_area',
                    'lahans.planting_area',
                    'lahans.opsi_pola_tanam',
                    'lahans.lahan_type',
                    'lahans.document_no',
                    'provinces.name as province',
                    'kabupatens.name as kabupaten', 
                    'kecamatans.name as kecamatan', 
                    'managementunits.name as mu',
                    'target_areas.name as ta',
                    'desas.name as desa',
                    'farmers.farmer_no as farmer_no', 
                    'farmers.name as farmer_name',
                    'lahans.user_id as ff_no',
                    'field_facilitators.name as ff_name',
                    'field_facilitators.fc_no',
                    'lahans.complete_data', 
                    'lahans.approve', 
                    'lahans.is_dell',
                    'lahans.updated_gis'
                )
                ->leftjoin('farmers', 'farmers.farmer_no', '=', 'lahans.farmer_no')
                ->leftjoin('field_facilitators', 'field_facilitators.ff_no', '=', 'lahans.user_id')
                ->leftjoin('provinces', 'provinces.province_code', '=', 'lahans.province')
                ->leftjoin('kabupatens', 'kabupatens.kabupaten_no', '=', 'lahans.city')
                ->leftjoin('kecamatans', 'kecamatans.kode_kecamatan', '=', 'lahans.kecamatan')
                ->leftjoin('managementunits', 'managementunits.mu_no', '=', 'lahans.mu_no')
                ->leftjoin('target_areas', 'target_areas.area_code', '=', 'lahans.target_area')
                ->leftjoin('desas', 'desas.kode_desa', '=', 'lahans.village')
                ->where([
                    'lahans.is_dell' => 0,
                    ['lahans.lahan_no','LIKE','10_%'],
                    ['lahans.user_id', 'LIKE', 'FF%'],
                    ['lahans.mu_no','LIKE',$mu],
                    ['lahans.target_area','LIKE',$ta],
                    ['lahans.village','LIKE',$village]
                ])
                ->whereYear('lahans.created_time', $py)
                ->orderby('lahans.lahan_no','asc');
                
                if ($ff) {
                    $ffdecode = (explode(",",$ff));
                    $GetLahanAll = $GetLahanAll->wherein('lahans.user_id',$ffdecode);
                }
                
                $GetLahanAll = $GetLahanAll->get();

                if(count($GetLahanAll)!=0){ 
                    
                    // $data = ['count'=>$count, 'data'=>$listval];
                    // $rslt =  $this->ResultReturn(200, 'success', $data);
                    // return response()->json($rslt, 200);
                    

                    $nama_title = "Data Lahan GEKO Tahun Program $py";  

                    // var_dump($listval);

                    return view('exportlahan', [
                        'py' => $py,
                        'listval' => $GetLahanAll,
                        'nama_title' => $nama_title
                    ]);
                }
                else{
                    $rslt =  $this->ResultReturn(404, 'doesnt match data', 'doesnt match data');
                    return response()->json($rslt, 404);
                } 
            }else{
                $rslt =  $this->ResultReturn(404, 'doesnt match data', 'doesnt match data');
                return response()->json($rslt, 404);
            }
        }catch(\Exception $ex){
            return response()->json($ex);
        }        
    }

    public function ExportLahanAllSuperAdmin(Request $request)
    {
        $typegetdata = $request->typegetdata;
        $ff = $request->ff;
        $getmu = $request->mu;
        $getta = $request->ta;
        $getvillage = $request->village;
        if($getmu){$mu='%'.$getmu.'%';}
        else{$mu='%%';}
        if($getta){$ta='%'.$getta.'%';}
        else{$ta='%%';}
        if($getvillage){$village='%'.$getvillage.'%';}
        else{$village='%%';}
        
        try{                    
            if($typegetdata == 'all' || $typegetdata == 'several'){
                if($typegetdata == 'all'){
                    $GetLahanAll = DB::table('lahans')->select('lahans.id as idTblLahan','lahans.lahan_no as lahanNo','lahans.longitude','lahans.latitude','lahans.coordinate',
                    'lahans.pohon_kayu','lahans.pohon_mpts','lahans.land_area','lahans.planting_area','kecamatans.name as nama_kec','managementunits.name as nama_mu',
                    'farmers.farmer_no as kodePetani', 'farmers.name as namaPetani','desas.name as namaDesa','lahans.user_id as ff_no','users.name as ff','lahans.complete_data', 'lahans.approve', 'lahans.is_dell')
                    ->leftjoin('farmers', 'farmers.farmer_no', '=', 'lahans.farmer_no')
                    ->leftjoin('users', 'users.employee_no', '=', 'lahans.user_id')
                    ->leftjoin('desas', 'desas.kode_desa', '=', 'lahans.village')
                    ->leftjoin('kecamatans', 'kecamatans.kode_kecamatan', '=', 'lahans.kecamatan')
                    ->leftjoin('managementunits', 'managementunits.mu_no', '=', 'lahans.mu_no')
                    ->where('lahans.is_dell','=',0)
                    ->where('lahans.lahan_no','not like','00_%')
                    ->where('lahans.mu_no','like',$mu)
                    ->where('lahans.target_area','like',$ta)
                    ->where('lahans.village','like',$village)
                    // ->where('lahans.lahan_no','=','10_0000005890')
                    ->orderby('lahans.lahan_no','asc')
                    ->get();
                }else{
                    $ffdecode = (explode(",",$ff));

                    $GetLahanAll = DB::table('lahans')->select('lahans.id as idTblLahan','lahans.lahan_no as lahanNo','lahans.longitude','lahans.latitude','lahans.coordinate',
                    'lahans.pohon_kayu','lahans.pohon_mpts','lahans.land_area','lahans.planting_area','kecamatans.name as nama_kec','managementunits.name as nama_mu',
                    'farmers.farmer_no as kodePetani', 'farmers.name as namaPetani','desas.name as namaDesa','lahans.user_id as ff_no','users.name as ff','lahans.complete_data', 'lahans.approve', 'lahans.is_dell')
                    ->leftjoin('farmers', 'farmers.farmer_no', '=', 'lahans.farmer_no')
                    ->leftjoin('users', 'users.employee_no', '=', 'lahans.user_id')
                    ->leftjoin('desas', 'desas.kode_desa', '=', 'lahans.village')
                    ->leftjoin('kecamatans', 'kecamatans.kode_kecamatan', '=', 'lahans.kecamatan')
                    ->leftjoin('managementunits', 'managementunits.mu_no', '=', 'lahans.mu_no')
                    ->where('lahans.is_dell','=',0)
                    ->wherein('lahans.user_id',$ffdecode)
                    ->where('lahans.mu_no','like',$mu)
                    ->where('lahans.target_area','like',$ta)
                    ->where('lahans.village','like',$village)
                    ->orderby('lahans.lahan_no','asc')
                    ->get();
                }

                $getTrees=DB::table('trees')
                        ->select('tree_name','tree_code')
                        ->get();

                $dataval = [];
                $listval=array();
                foreach ($GetLahanAll as $val) {
                    $status = '';
                    if($val->complete_data==1 && $val->approve==1){
                        $status = 'Sudah Verifikasi';
                    }else if($val->complete_data==1 && $val->approve==0){
                        $status = 'Belum Verifikasi';
                    }else{
                        $status = 'Belum Lengkap';
                    }

                    // var_dump($val->ff_no);
                    $getFF=DB::table('field_facilitators')
                    ->select('fc_no')
                    ->where('ff_no', '=',$val->ff_no)
                    ->first();
                    // var_dump($getFF);
                    if($getFF){
                        $getFC=DB::table('employees')
                        ->select('name')
                        ->where('nik', '=',$getFF->fc_no)
                        ->first();
                        $nama_fc = $getFC->name;
                    }else{
                        $nama_fc = '-';
                    }

                    $lahan_details=DB::table('lahan_details')
                            ->select('tree_code')
                            ->where('lahan_no', '=',$val->lahanNo)
                            ->get();

                    $listlhndtl=array();
                    array_push($listlhndtl, 'Nilai0Array');
                    foreach ($lahan_details as $lhndtl) {
                        array_push($listlhndtl, $lhndtl->tree_code);
                    }

                    // print_r($listlhndtl);

                    $datavaltrees = [];
                    $listvaltrees=array();
                    foreach ($getTrees as $value) {
                        $countPohon = 0;

                        $rslt_search = array_search($value->tree_code,$listlhndtl);

                        // var_dump($value->tree_code);
                        // var_dump($rslt_search);
                        // var_dump('---------');
                        
                        if($rslt_search){
                            // var_dump($rslt_search);
                            $getPohonFix=DB::table('lahan_details')
                            ->where('lahan_no', '=',$val->lahanNo)
                            ->where('tree_code', '=',$value->tree_code)
                            ->first();
                            $countPohon = $getPohonFix->amount;
                        }else{
                            $countPohon = 0;
                        }
                        // echo '<br>';

                        array_push($listvaltrees, $countPohon);
                    }
                    

                    // var_dump($getFC->name);

                    $dataval = ['idTblLahan'=>$val->idTblLahan,'lahanNo'=>$val->lahanNo, 'location'=>$val->latitude." ".$val->longitude, 'coordinate'=>$val->coordinate,
                    'kodePetani'=>$val->kodePetani, 'petani'=>$val->namaPetani, 'desa' => $val->namaDesa, 'user' => $val->ff, 'status' => $status,
                    'pohon_kayu' => $val->pohon_kayu,'pohon_mpts' => $val->pohon_mpts,'land_area' => $val->land_area,'planting_area' => $val->planting_area, 
                    'ff' => $val->ff,'nama_fc_lahan' => $nama_fc,'nama_kec' => $val->nama_kec,'nama_mu' => $val->nama_mu,'is_dell' => $val->is_dell,'listvaltrees' => $listvaltrees];
                    array_push($listval, $dataval);
                }

                if(count($GetLahanAll)!=0){ 
                    
                    // $data = ['count'=>$count, 'data'=>$listval];
                    // $rslt =  $this->ResultReturn(200, 'success', $data);
                    // return response()->json($rslt, 200);
                    

                    $nama_title = 'Cetak Excel Data Lahan';  

                    // var_dump($listval);

                    return view('exportlahanSuperAdmin', compact('listval', 'nama_title', 'getTrees'));
                }
                else{
                    $rslt =  $this->ResultReturn(404, 'doesnt match data', 'doesnt match data');
                    return response()->json($rslt, 404);
                } 
            }else{
                $rslt =  $this->ResultReturn(404, 'doesnt match data', 'doesnt match data');
                return response()->json($rslt, 404);
            }
        }catch(\Exception $ex){
            return response()->json($ex);
        }        
    }

    /**
     * @SWG\Get(
     *   path="/api/GetLahanAll",
     *   tags={"Lahan"},
     *   security={
	 *     {"apiAuth": {}},
	 *   },
     *   summary="Get Lahan All",
     *   operationId="GetLahanAll",
     *   @SWG\Response(response=200, description="successful operation"),
     *   @SWG\Response(response=401, description="Unauthenticated"),
     *   @SWG\Response(response=500, description="internal server error"),
     *      @SWG\Parameter(name="user_id",in="query", required=true, type="string"),
     *      @SWG\Parameter(name="farmer_no",in="query", type="string"),
     *      @SWG\Parameter(name="limit",in="query", type="integer"),
     *      @SWG\Parameter(name="offset",in="query", type="integer"),
     *      @SWG\Parameter(name="program_year",in="query", type="string"),
     * )
     */
    public function GetLahanAll(Request $request){
        $limit = $this->limitcheck($request->limit);
        $offset =  $this->offsetcheck($limit, $request->offset);
        $getfarmerno = $request->farmer_no;
        $py = $request->program_year;
        if($getfarmerno){$farmer_no='%'.$getfarmerno.'%';}
        else{$farmer_no='%%';}
        try{
            if($farmer_no!='%%'){
                $GetLahanAll = Lahan::where('user_id', '=', $request->user_id)->where('farmer_no','like',$farmer_no)->where('is_dell', '=', 0)->orderBy('id', 'ASC')->get();
            }else{
                $GetLahanAll = Lahan::where('user_id', '=', $request->user_id)->where('is_dell', '=', 0)->where('created_time', 'NOT LIKE', "2020%%")->orderBy('id', 'ASC')->get();
            }

            if(count($GetLahanAll)!=0){
                if($farmer_no!='%%'){
                    $count = Lahan::where('user_id', '=', $request->user_id)->where('farmer_no','like',$farmer_no)->where('is_dell', '=', 0)->count();
                }else{
                    $count = Lahan::where('user_id', '=', $request->user_id)->where('is_dell', '=', 0)->where('created_time', 'NOT LIKE', "2020%%")->count();
                }
                
                foreach ($GetLahanAll as $detail) {
                    $getPivot = MainPivot::where([
                        'key2' => $detail->lahan_no,
                        'key1' => $detail->farmer_no,
                        'type' => 'farmer_lahan'
                    ])->first();
                    $detail->year = $getPivot->program_year ?? '';
                    
                    if($request->year != null){
                        $getTutupan = LahanTutupan::where([
                            'lahan_no' => $detail->lahan_no
                            // 'program_year' => $request->year
                        ])->orderBy('id','desc')->first();
                        $detail->tutupan = $getTutupan->tutupan_lahan ?? "-";
                        $detail->pola_tanam = $getTutupan->pattern ?? "-";
                        $detail->project_lahan = LahanProject::where(['lahan_no' => $detail->lahan_no, 'program_year' => $request->year])->get();
                        $project = LahanProject::where(['lahan_no' => $detail->lahan_no])->where('program_year', 'LIKE', "%%$request->year%%")->first();
                        $detail->project_no = $project->project_no ?? "-";
                    }
                    
                    $getFarmer = Farmer::where('farmer_no',$detail->farmer_no)->first();
                    $detail->namaPetani = $getFarmer->nickname ?? $getFarmer->name ?? "";
                    $detail->polygons = LahanPolygon::where('lahan_no',$detail->lahan_no)->get();
                    if($detail->approve > 0){
                        $detail->approve = 1;
                    }
                    
                    $getKec = Kecamatan::where('kode_kecamatan', $detail->kecamatan)->first();
                    $getDesa = Desa::where('kode_desa', $detail->village)->first();
                    $detail->desa = $getDesa->name." - ".$getKec->name;
                }
                $data = ['count'=>$count, 'data'=>$GetLahanAll];
                $rslt =  $this->ResultReturn(200, 'success', $data);
                return response()->json($rslt, 200);  
            }
            else{
                $rslt =  $this->ResultReturn(404, 'doesnt match data', 'doesnt match data');
                return response()->json($rslt, 404);
            } 
        }catch (\Exception $ex){
            return response()->json($ex);
        }
    }
    
    public function GetLahanAllDesa(Request $request){
        $userId = $request->user_id;
        $getvillage = $request->farmer_no;
        $year = $request->year ?? "2024";

        $GetLahanAll = Lahan::where('farmer_no', '=', $getvillage)
                ->where('is_dell', '=', 0)
                ->where('user_id', '!=', $userId)
                ->where('created_time', 'NOT LIKE', "$year%%")
                ->orderBy('lahan_no', 'ASC')
                ->get();
                
        if(count($GetLahanAll)!=0){
            $lahanDetail = [];
            foreach($GetLahanAll as $pIndex => $lahans){
                $detail = LahanDetail::where(['lahan_no' => $lahans->lahan_no])->get();
                array_push($lahanDetail, ...$detail);
                
                $getPivot = MainPivot::where([
                        'key2' => $lahans->lahan_no,
                        'key1' => $lahans->farmer_no,
                        'type' => 'farmer_lahan'
                    ])->first();
                    $lahans->year = $getPivot->program_year ?? '';
                    if($lahans->approve > 0){
                       $lahans->approve = 1; 
                    }
                    
                    if($request->year != null){
                        $getTutupan = LahanTutupan::where([
                            'lahan_no' => $lahans->lahan_no
                            // 'program_year' => $request->year
                        ])->orderBy('id','desc')->first();
                        $lahans->tutupan = $getTutupan->tutupan_lahan ?? "-";
                        $lahans->pola_tanam = $getTutupan->pattern ?? "-";
                    }
                    
                    $getFarmer = Farmer::where('farmer_no',$lahans->farmer_no)->first();
                    $lahans->namaPetani = $getFarmer->nickname ?? $getFarmer->name;
                    
                    $getKec = Kecamatan::where('kode_kecamatan', $lahans->kecamatan)->first();
                    $getDesa = Desa::where('kode_desa', $lahans->village)->first();
                    $lahans->desa = $getDesa->name." - ".$getKec->name;
            }
            
            $count = count($GetLahanAll);
            $data = ['count'=>$count, 'data'=>$GetLahanAll, 'detail'=>$lahanDetail];
            $rslt =  $this->ResultReturn(200, 'success', $data);
            return response()->json($rslt, 200);
        }else{
            $rslt =  $this->ResultReturn(404, 'doesnt match data', 'doesnt match data');
            return response()->json($rslt, 404);
        }
    }
    
    /**
     * @SWG\Get(
     *   path="/api/GetLahanNotComplete",
     *   tags={"Lahan"},
     *   security={
	 *     {"apiAuth": {}},
	 *   },
     *   summary="Get Lahan Not Complete",
     *   operationId="GetLahanNotComplete",
     *   @SWG\Response(response=200, description="successful operation"),
     *   @SWG\Response(response=401, description="Unauthenticated"),
     *   @SWG\Response(response=500, description="internal server error"),
     *      @SWG\Parameter(name="user_id",in="query", required=true, type="string"),
     *      @SWG\Parameter(name="farmer_no",in="query", type="string"),
     *      @SWG\Parameter(name="limit",in="query", type="integer"),
     *      @SWG\Parameter(name="offset",in="query", type="integer"),
     * )
     */
    public function GetLahanNotComplete(Request $request){
        $limit = $this->limitcheck($request->limit);
        $offset =  $this->offsetcheck($limit, $request->offset);
        $getfarmerno = $request->farmer_no;
        if($getfarmerno){$farmer_no='%'.$getfarmerno.'%';}
        else{$farmer_no='%%';}
        try{
            // var_dump(count($GetLahanNotComplete));
            if($farmer_no!='%%'){
                $GetLahanNotComplete = Lahan::where('user_id', '=', $request->user_id)->where('farmer_no','like',$farmer_no)->where('is_dell', '=', 0)->where('complete_data', '=', 0)->orderBy('id', 'ASC')->limit($limit)->offset($offset)->get();
            }else{
                $GetLahanNotComplete = Lahan::where('user_id', '=', $request->user_id)->where('is_dell', '=', 0)->where('complete_data', '=', 0)->orderBy('id', 'ASC')->limit($limit)->offset($offset)->get();
            }
            if(count($GetLahanNotComplete)!=0){
                
                if($farmer_no!='%%'){
                    $count = Lahan::where('user_id', '=', $request->user_id)->where('farmer_no','like',$farmer_no)->where('is_dell', '=', 0)->where('complete_data', '=', 0)->count();
                }else{
                    $count = Lahan::where('user_id', '=', $request->user_id)->where('is_dell', '=', 0)->where('complete_data', '=', 0)->count();
                }
                $data = ['count'=>$count, 'data'=>$GetLahanNotComplete];
                $rslt =  $this->ResultReturn(200, 'success', $data);
                return response()->json($rslt, 200);  
            }
            else{
                $rslt =  $this->ResultReturn(404, 'doesnt match data', 'doesnt match data');
                return response()->json($rslt, 404);
            } 
        }catch (\Exception $ex){
            return response()->json($ex);
        }
    }
    
    /**
     * @SWG\Get(
     *   path="/api/GetLahanCompleteNotApprove",
     *   tags={"Lahan"},
     *   security={
	 *     {"apiAuth": {}},
	 *   },
     *   summary="Get Lahan Complete Not Approve",
     *   operationId="GetLahanCompleteNotApprove",
     *   @SWG\Response(response=200, description="successful operation"),
     *   @SWG\Response(response=401, description="Unauthenticated"),
     *   @SWG\Response(response=500, description="internal server error"),
     *      @SWG\Parameter(name="user_id",in="query", required=true,  type="string"),
     *      @SWG\Parameter(name="farmer_no",in="query", type="string"),
     *      @SWG\Parameter(name="limit",in="query", type="integer"),
     *      @SWG\Parameter(name="offset",in="query", type="integer"),
     * )
     */
    public function GetLahanCompleteNotApprove(Request $request){
        $limit = $this->limitcheck($request->limit);
        $offset =  $this->offsetcheck($limit, $request->offset);
        $getfarmerno = $request->farmer_no;
        if($getfarmerno){$farmer_no='%'.$getfarmerno.'%';}
        else{$farmer_no='%%';}
        try{            
            if($farmer_no!='%%'){
                $GetLahanCompleteNotApprove = Lahan::where('user_id', '=', $request->user_id)->where('farmer_no', 'Like', $farmer_no)->where('is_dell', '=', 0)->where('complete_data', '=', 1)->where('approve', '=', 0)->orderBy('id', 'ASC')->limit($limit)->offset($offset)->get();
            }else{
                $GetLahanCompleteNotApprove = Lahan::where('user_id', '=', $request->user_id)->where('is_dell', '=', 0)->where('complete_data', '=', 1)->where('approve', '=', 0)->orderBy('id', 'ASC')->limit($limit)->offset($offset)->get();
            }
            if(count($GetLahanCompleteNotApprove)!=0){
                
                if($farmer_no!='%%'){
                    $count = Lahan::where('user_id', '=', $request->user_id)->where('is_dell', '=', 0)->where('farmer_no', 'Like', $farmer_no)->where('complete_data', '=', 1)->where('approve', '=', 0)->count();
                }else{
                    $count = Lahan::where('user_id', '=', $request->user_id)->where('is_dell', '=', 0)->where('complete_data', '=', 1)->where('approve', '=', 0)->count();
                }
                $data = ['count'=>$count, 'data'=>$GetLahanCompleteNotApprove];
                $rslt =  $this->ResultReturn(200, 'success', $data);
                return response()->json($rslt, 200);  
            }
            else{
                $rslt =  $this->ResultReturn(404, 'doesnt match data', 'doesnt match data');
                return response()->json($rslt, 404);
            } 
        }catch (\Exception $ex){
            return response()->json($ex);
        }
    }
    
    /**
     * @SWG\Get(
     *   path="/api/GetCompleteAndApprove",
     *   tags={"Lahan"},
     *   security={
	 *     {"apiAuth": {}},
	 *   },
     *   summary="Get Complete And Approve",
     *   operationId="GetCompleteAndApprove",
     *   @SWG\Response(response=200, description="successful operation"),
     *   @SWG\Response(response=401, description="Unauthenticated"),
     *   @SWG\Response(response=500, description="internal server error"),
     *      @SWG\Parameter(name="user_id",in="query", required=true,  type="string"),
     *      @SWG\Parameter(name="farmer_no",in="query", type="string"),
     *      @SWG\Parameter(name="limit",in="query", type="integer"),
     *      @SWG\Parameter(name="offset",in="query", type="integer"),
     * )
     */
    public function GetCompleteAndApprove(Request $request){
        $limit = $this->limitcheck($request->limit);
        $offset =  $this->offsetcheck($limit, $request->offset);
        $getfarmerno = $request->farmer_no;
        if($getfarmerno){$farmer_no='%'.$getfarmerno.'%';}
        else{$farmer_no='%%';}
        try{
            
            if($farmer_no!='%%'){
                $GetCompleteAndApprove = Lahan::where('user_id', '=', $request->user_id)->where('farmer_no', 'Like', $farmer_no)->where('is_dell', '=', 0)->where('complete_data', '=', 1)->where('approve', '=', 1)->orderBy('id', 'ASC')->limit($limit)->offset($offset)->get();
            }else{
                $GetCompleteAndApprove = Lahan::where('user_id', '=', $request->user_id)->where('is_dell', '=', 0)->where('complete_data', '=', 1)->where('approve', '=', 1)->orderBy('id', 'ASC')->limit($limit)->offset($offset)->get();
            }
            if(count($GetCompleteAndApprove)!=0){
                
                if($farmer_no!='%%'){
                    $count = Lahan::where('user_id', '=', $request->user_id)->where('farmer_no', 'Like', $farmer_no)->where('is_dell', '=', 0)->where('complete_data', '=', 1)->where('approve', '=', 1)->count();
                }else{
                    $count = Lahan::where('user_id', '=', $request->user_id)->where('is_dell', '=', 0)->where('complete_data', '=', 1)->where('approve', '=', 1)->count();
                }
                $data = ['count'=>$count, 'data'=>$GetCompleteAndApprove];
                $rslt =  $this->ResultReturn(200, 'success', $data);
                return response()->json($rslt, 200);  
            }
            else{
                $rslt =  $this->ResultReturn(404, 'doesnt match data', 'doesnt match data');
                return response()->json($rslt, 404);
            } 
        }catch (\Exception $ex){
            return response()->json($ex);
        }
    }

    /**
     * @SWG\Get(
     *   path="/api/GetLahanDetail",
     *   tags={"Lahan"},
     *   security={
	 *     {"apiAuth": {}},
	 *   },
     *   summary="Get Lahan Detail",
     *   operationId="GetLahanDetail",
     *   @SWG\Response(response=200, description="successful operation"),
     *   @SWG\Response(response=401, description="Unauthenticated"),
     *   @SWG\Response(response=500, description="internal server error"),
     *      @SWG\Parameter(name="id",in="query", required=true,  type="string")
     * )
     */
    public function GetLahanDetail(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'id' => 'required'
            ]);
    
            if($validator->fails()){
                $rslt =  $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
                return response()->json($rslt, 400);
            }
            $GetLahanDetail = 
            DB::table('lahans')->select('lahans.id','lahans.lahan_no','lahans.document_no','lahans.land_area',
            'lahans.planting_area','lahans.longitude','lahans.latitude','lahans.coordinate','lahans.internal_code',
            'lahans.polygon','lahans.village','lahans.kecamatan','lahans.city','lahans.province',
            'lahans.description','lahans.elevation','lahans.soil_type','lahans.current_crops',
            'lahans.active','lahans.farmer_no','lahans.farmer_temp','lahans.mu_no',
            'lahans.target_area','lahans.user_id','lahans.sppt','lahans.tutupan_lahan',
            'lahans.photo1','lahans.photo2','lahans.photo3','lahans.photo4','lahans.group_no','lahans.kelerengan_lahan',
            'lahans.fertilizer','lahans.pesticide','lahans.access_to_water_sources','lahans.water_availability',
            'lahans.access_to_lahan','lahans.potency','lahans.barcode','lahans.lahan_type','lahans.jarak_lahan','lahans.exposure',
            'lahans.opsi_pola_tanam','lahans.type_sppt','lahans.complete_data','lahans.approve',
            'lahans.pohon_kayu','lahans.pohon_mpts',
            'provinces.name as namaProvinsi','kabupatens.name as namaKabupaten','kecamatans.name as namaKecamatan',
            'desas.name as namaDesa','target_areas.name as namaTa','managementunits.name as namaMu','farmers.name as namaPetani','farmer_groups.name as namaKelompok', 'lahans.created_at')
            ->leftjoin('provinces', 'provinces.province_code', '=', 'lahans.province')
            ->leftjoin('kabupatens', 'kabupatens.kabupaten_no', '=', 'lahans.city')
            ->leftjoin('kecamatans', 'kecamatans.kode_kecamatan', '=', 'lahans.kecamatan')
            ->leftjoin('desas', 'desas.kode_desa', '=', 'lahans.village')
            ->leftjoin('target_areas', 'target_areas.area_code', '=', 'lahans.target_area')
            ->leftjoin('managementunits', 'managementunits.mu_no', '=', 'lahans.mu_no')
            ->leftjoin('farmers', 'farmers.farmer_no', '=', 'lahans.farmer_no')
            ->leftjoin('farmer_groups', 'farmer_groups.group_no', '=', 'lahans.group_no');   
            
            if ($request->lahan_no) $GetLahanDetail = $GetLahanDetail->where('lahans.lahan_no', '=', $request->lahan_no); 
            else $GetLahanDetail = $GetLahanDetail->where('lahans.id', '=', $request->id);
            
            $GetLahanDetail = $GetLahanDetail->first();
            
            $ff = FieldFacilitator::where('ff_no', $GetLahanDetail->user_id)->first();
            
            if($GetLahanDetail){
                $getDetailTreesLAhan =  DB::table('lahan_details')->select('lahan_details.id','lahan_details.lahan_no','lahan_details.tree_code','lahan_details.amount',
                'lahan_details.detail_year','tree_locations.category as tree_category','tree_locations.tree_name')
                ->leftjoin('tree_locations', 'tree_locations.tree_code', '=', 'lahan_details.tree_code')
                ->where('lahan_details.lahan_no', '=', $GetLahanDetail->lahan_no)
                ->where('tree_locations.mu_no', $ff->mu_no)
                ->get();

                // var_dump($getDetailTreesLAhan);


                $LahanDetailNew = ['id'=>$GetLahanDetail->id,'lahan_no'=>$GetLahanDetail->lahan_no,'document_no'=>$GetLahanDetail->document_no,'internal_code'=>$GetLahanDetail->internal_code,'land_area'=>$GetLahanDetail->land_area,'planting_area'=>$GetLahanDetail->planting_area,
                'longitude'=>$GetLahanDetail->longitude,'latitude'=>$GetLahanDetail->latitude,'coordinate'=>$GetLahanDetail->coordinate,'polygon'=>$GetLahanDetail->polygon,'village'=>$GetLahanDetail->village,
                'kecamatan'=>$GetLahanDetail->kecamatan,'city'=>$GetLahanDetail->city,'province'=>$GetLahanDetail->province,'description'=>$GetLahanDetail->description,'elevation'=>$GetLahanDetail->elevation,
                'soil_type'=>$GetLahanDetail->soil_type,'current_crops'=>$GetLahanDetail->current_crops,'active'=>$GetLahanDetail->active,'farmer_no'=>$GetLahanDetail->farmer_no,'farmer_temp'=>$GetLahanDetail->farmer_temp,
                'mu_no'=>$GetLahanDetail->mu_no,'target_area'=>$GetLahanDetail->target_area,'user_id'=>$GetLahanDetail->user_id,'sppt'=>$GetLahanDetail->sppt,'tutupan_lahan'=>$GetLahanDetail->tutupan_lahan,
                'complete_data'=>$GetLahanDetail->complete_data,'approve'=>$GetLahanDetail->approve,
                'tutupan_lahan'=>$GetLahanDetail->tutupan_lahan,'photo1'=>$GetLahanDetail->photo1,'photo2'=>$GetLahanDetail->photo2,'photo3'=>$GetLahanDetail->photo3,'photo4'=>$GetLahanDetail->photo4,
                'group_no'=>$GetLahanDetail->group_no,'kelerengan_lahan'=>$GetLahanDetail->kelerengan_lahan,'fertilizer'=>$GetLahanDetail->fertilizer,'pesticide'=>$GetLahanDetail->pesticide,'access_to_water_sources'=>$GetLahanDetail->access_to_water_sources,
                'water_availability'=>$GetLahanDetail->water_availability,'access_to_lahan'=>$GetLahanDetail->access_to_lahan,'potency'=>$GetLahanDetail->potency,'barcode'=>$GetLahanDetail->barcode,'lahan_type'=>$GetLahanDetail->lahan_type,
                'jarak_lahan'=>$GetLahanDetail->jarak_lahan,'exposure'=>$GetLahanDetail->exposure,'namaProvinsi'=>$GetLahanDetail->namaProvinsi,'namaKabupaten'=>$GetLahanDetail->namaKabupaten,'namaKecamatan'=>$GetLahanDetail->namaKecamatan,
                'namaDesa'=>$GetLahanDetail->namaDesa,'namaTa'=>$GetLahanDetail->namaTa,'namaMu'=>$GetLahanDetail->namaMu,'namaPetani'=>$GetLahanDetail->namaPetani,'namaKelompok'=>$GetLahanDetail->namaKelompok,
                'pohon_kayu'=>$GetLahanDetail->pohon_kayu,'pohon_mpts'=>$GetLahanDetail->pohon_mpts,
                'opsi_pola_tanam'=>$GetLahanDetail->opsi_pola_tanam,'type_sppt'=>$GetLahanDetail->type_sppt,'created_at'=>$GetLahanDetail->created_at,'DetailTreesLahan'=>$getDetailTreesLAhan];
                $rslt =  $this->ResultReturn(200, 'success', $LahanDetailNew);
                return response()->json($rslt, 200);  
            }
            else{
                $rslt =  $this->ResultReturn(404, 'doesnt match data', 'doesnt match data');
                return response()->json($rslt, 404);
            } 
        }catch (\Exception $ex){
            return response()->json($ex);
        }
    }

    /**
     * @SWG\Get(
     *   path="/api/GetLahanDetailLahanNo",
     *   tags={"Lahan"},
     *   security={
	 *     {"apiAuth": {}},
	 *   },
     *   summary="Get Lahan Detail LahanNo",
     *   operationId="GetLahanDetailLahanNo",
     *   @SWG\Response(response=200, description="successful operation"),
     *   @SWG\Response(response=401, description="Unauthenticated"),
     *   @SWG\Response(response=500, description="internal server error"),
     *      @SWG\Parameter(name="lahan_no",in="query", required=true,  type="string")
     * )
     */
    public function GetLahanDetailLahanNo(Request $request){
        // try{
            $validator = Validator::make($request->all(), [
                'lahan_no' => 'required'
            ]);
    
            if($validator->fails()){
                $rslt =  $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
                return response()->json($rslt, 400);
            }
            $GetLahanDetail = 
            DB::table('lahans')->select('lahans.id','lahans.lahan_no','lahans.document_no','lahans.land_area',
            'lahans.planting_area','lahans.gis_polygon_area','lahans.gis_planting_area','lahans.longitude','lahans.latitude','lahans.coordinate','lahans.internal_code',
            'lahans.polygon','lahans.village','lahans.kecamatan','lahans.city','lahans.province',
            'lahans.description','lahans.elevation','lahans.soil_type','lahans.current_crops',
            'lahans.active','lahans.farmer_no','lahans.farmer_temp','lahans.mu_no',
            'lahans.target_area','lahans.user_id','lahans.sppt','lahans.tutupan_lahan',
            'lahans.photo1','lahans.photo2','lahans.photo3','lahans.photo4','lahans.group_no','lahans.kelerengan_lahan',
            'lahans.fertilizer','lahans.pesticide','lahans.access_to_water_sources','lahans.water_availability',
            'lahans.access_to_lahan','lahans.potency','lahans.barcode','lahans.lahan_type','lahans.jarak_lahan','lahans.exposure',
            'lahans.opsi_pola_tanam','lahans.type_sppt','lahans.complete_data','lahans.approve', 'lahans.created_time',
            'lahans.pohon_kayu','lahans.pohon_mpts',
            'provinces.name as namaProvinsi','kabupatens.name as namaKabupaten','kecamatans.name as namaKecamatan',
            'desas.name as namaDesa','target_areas.name as namaTa','managementunits.name as namaMu','farmers.name as namaPetani','farmer_groups.name as namaKelompok')
            ->where('lahans.lahan_no', '=', $request->lahan_no)
            ->leftjoin('provinces', 'provinces.province_code', '=', 'lahans.province')
            ->leftjoin('kabupatens', 'kabupatens.kabupaten_no', '=', 'lahans.city')
            ->leftjoin('kecamatans', 'kecamatans.kode_kecamatan', '=', 'lahans.kecamatan')
            ->leftjoin('desas', 'desas.kode_desa', '=', 'lahans.village')
            ->leftjoin('target_areas', 'target_areas.area_code', '=', 'lahans.target_area')
            ->leftjoin('managementunits', 'managementunits.mu_no', '=', 'lahans.mu_no')
            ->leftjoin('farmers', 'farmers.farmer_no', '=', 'lahans.farmer_no')
            ->leftjoin('farmer_groups', 'farmer_groups.group_no', '=', 'lahans.group_no')
            ->first();            
            
            if($GetLahanDetail){
                $getDetailTreesLAhan =  DB::table('lahan_details')->select('lahan_details.id','lahan_details.lahan_no','lahan_details.tree_code','lahan_details.amount',
                'lahan_details.detail_year','trees.tree_category','trees.tree_name')
                ->leftjoin('trees', 'trees.tree_code', '=', 'lahan_details.tree_code')
                ->where('lahan_details.lahan_no', '=', $GetLahanDetail->lahan_no)
                ->get();

                // var_dump($getDetailTreesLAhan);
                $getPivot = MainPivot::where([
                        'key2' => $GetLahanDetail->lahan_no,
                        'key1' => $GetLahanDetail->farmer_no,
                        'type' => 'farmer_lahan'
                    ])->first();
                
                $getTutupan = LahanTutupan::where([
                        'lahan_no' => $GetLahanDetail->lahan_no
                        // 'program_year' => $request->year
                    ])->orderBy('id','desc')->first();
                
                $area = $GetLahanDetail->gis_polygon_area > 0 && $GetLahanDetail->gis_polygon_area != NULL ? $GetLahanDetail->gis_polygon_area : $GetLahanDetail->land_area;
                $planting = $GetLahanDetail->gis_planting_area > 0 && $GetLahanDetail->gis_planting_area != NULL ? $GetLahanDetail->gis_planting_area : $GetLahanDetail->planting_area;

                $LahanDetailNew = ['id'=>$GetLahanDetail->id,'lahan_no'=>$GetLahanDetail->lahan_no,'document_no'=>$GetLahanDetail->document_no,'internal_code'=>$GetLahanDetail->internal_code,'land_area'=>$area,'planting_area'=>$planting,
                'longitude'=>$GetLahanDetail->longitude,'latitude'=>$GetLahanDetail->latitude,'coordinate'=>$GetLahanDetail->coordinate,'polygon'=>$GetLahanDetail->polygon,'village'=>$GetLahanDetail->village,
                'kecamatan'=>$GetLahanDetail->kecamatan,'city'=>$GetLahanDetail->city,'province'=>$GetLahanDetail->province,'description'=>$GetLahanDetail->description,'elevation'=>$GetLahanDetail->elevation,
                'soil_type'=>$GetLahanDetail->soil_type,'current_crops'=>$GetLahanDetail->current_crops,'active'=>$GetLahanDetail->active,'farmer_no'=>$GetLahanDetail->farmer_no,'farmer_temp'=>$GetLahanDetail->farmer_temp,
                'mu_no'=>$GetLahanDetail->mu_no,'target_area'=>$GetLahanDetail->target_area,'user_id'=>$GetLahanDetail->user_id,'sppt'=>$GetLahanDetail->sppt,'tutupan_lahan'=>$GetLahanDetail->tutupan_lahan,
                'complete_data'=>$GetLahanDetail->complete_data,'approve'=>$GetLahanDetail->approve, 'created_time'=>$GetLahanDetail->created_time,
                'tutupan_lahan'=>$GetLahanDetail->tutupan_lahan,'photo1'=>$GetLahanDetail->photo1,'photo2'=>$GetLahanDetail->photo2,'photo3'=>$GetLahanDetail->photo3,'photo4'=>$GetLahanDetail->photo4,
                'group_no'=>$GetLahanDetail->group_no,'kelerengan_lahan'=>$GetLahanDetail->kelerengan_lahan,'fertilizer'=>$GetLahanDetail->fertilizer,'pesticide'=>$GetLahanDetail->pesticide,'access_to_water_sources'=>$GetLahanDetail->access_to_water_sources,
                'water_availability'=>$GetLahanDetail->water_availability,'access_to_lahan'=>$GetLahanDetail->access_to_lahan,'potency'=>$GetLahanDetail->potency,'barcode'=>$GetLahanDetail->barcode,'lahan_type'=>$GetLahanDetail->lahan_type,
                'jarak_lahan'=>$GetLahanDetail->jarak_lahan,'exposure'=>$GetLahanDetail->exposure,'namaProvinsi'=>$GetLahanDetail->namaProvinsi,'namaKabupaten'=>$GetLahanDetail->namaKabupaten,'namaKecamatan'=>$GetLahanDetail->namaKecamatan,
                'namaDesa'=>$GetLahanDetail->namaDesa,'namaTa'=>$GetLahanDetail->namaTa,'namaMu'=>$GetLahanDetail->namaMu,'namaPetani'=>$GetLahanDetail->namaPetani,'namaKelompok'=>$GetLahanDetail->namaKelompok,
                'pohon_kayu'=>$GetLahanDetail->pohon_kayu,'pohon_mpts'=>$GetLahanDetail->pohon_mpts,'desa'=>$GetLahanDetail->namaDesa.' - '.$GetLahanDetail->namaKecamatan,
                'opsi_pola_tanam'=>$GetLahanDetail->opsi_pola_tanam,'type_sppt'=>$GetLahanDetail->type_sppt,'year' => $getPivot->program_year ?? '','tutupan' => $getTutupan->tutupan_lahan ?? '-','pola_tanam' => $getTutupan->pattern ?? '-','DetailTreesLahan'=>$getDetailTreesLAhan];
                    
                $rslt =  $this->ResultReturn(200, 'success', $LahanDetailNew);
                return response()->json($rslt, 200);  
            }
            else{
                $rslt =  $this->ResultReturn(404, 'doesnt match data', 'doesnt match data');
                return response()->json($rslt, 404);
            } 
        // }catch (\Exception $ex){
        //     return response()->json($ex);
        // }
    }

    /**
     * @SWG\Get(
     *   path="/api/GetLahanDetailBarcode",
     *   tags={"Lahan"},
     *   security={
	 *     {"apiAuth": {}},
	 *   },
     *   summary="Get Lahan Detail Barcode",
     *   operationId="GetLahanDetailBarcode",
     *   @SWG\Response(response=200, description="successful operation"),
     *   @SWG\Response(response=401, description="Unauthenticated"),
     *   @SWG\Response(response=500, description="internal server error"),
     *      @SWG\Parameter(name="barcode",in="query", required=true, type="string")
     * )
     */
    public function GetLahanDetailBarcode(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'barcode' => 'required|string|max:255'
            ]);
    
            if($validator->fails()){
                $rslt =  $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
                return response()->json($rslt, 400);
            }
            $GetLahanDetailBarcode = 
            DB::table('lahans')->where('lahans.barcode', '=', $request->barcode)
            ->leftjoin('provinces', 'provinces.province_code', '=', 'lahans.province')
            ->leftjoin('kabupatens', 'kabupatens.kabupaten_no', '=', 'lahans.city')
            ->leftjoin('kecamatans', 'kecamatans.kode_kecamatan', '=', 'lahans.kecamatan')
            ->leftjoin('desas', 'desas.kode_desa', '=', 'lahans.village')
            ->first();
            if($GetLahanDetailBarcode){
                $rslt =  $this->ResultReturn(200, 'success', $GetLahanDetailBarcode);
                return response()->json($rslt, 200);  
            }
            else{
                $rslt =  $this->ResultReturn(404, 'doesnt match data', 'doesnt match data');
                return response()->json($rslt, 404);
            } 
        }catch (\Exception $ex){
            return response()->json($ex);
        }
    }
    

    /**
     * @SWG\Post(
     *   path="/api/AddMandatoryLahan",
	 *   tags={"Lahan"},
     *   security={
	 *     {"apiAuth": {}},
	 *   },
     *   summary="Add Mandatory Lahan",
     *   operationId="AddMandatoryLahan",
     *   @SWG\Response(response=200, description="successful operation"),
     *   @SWG\Response(response=401, description="Unauthenticated"),
     *   @SWG\Response(response=404, description="Not Found"),
     *   @SWG\Response(response=500, description="internal server error"),
	 *		@SWG\Parameter(
     *          name="Parameters",
     *          in="body",
	 *			description="Add Mandatory Lahan",
     *          required=true, 
     *          type="string",
	 *   		@SWG\Schema(
     *              @SWG\Property(property="document_no", type="string", example="0909090909"),
     *              @SWG\Property(property="type_sppt", type="integer", example=1),
     *              @SWG\Property(property="land_area", type="string", example="8200.00"),
     *              @SWG\Property(property="longitude", type="date", example="110.3300613"),
     *              @SWG\Property(property="latitude", type="string", example="-7.580778"),
     *              @SWG\Property(property="village", type="string", example="33.05.10.18"),
     *              @SWG\Property(property="mu_no", type="string", example="025"),
     *              @SWG\Property(property="target_area", type="string", example="025001"),
     *              @SWG\Property(property="farmer_no", type="string", example="F00000001"),
     *              @SWG\Property(property="fertilizer", type="string", example="Kimia"),   
     *              @SWG\Property(property="pesticide", type="string", example="Kimia"),
     *              @SWG\Property(property="sppt", type="string", example="File"),
     *              @SWG\Property(property="active", type="int", example="1"),
     *              @SWG\Property(property="user_id", type="string", example="U0002")
     *          ),
     *      )
     * )
     *
     */
     public function LahansTestAPI(Request $request){
        $getLastIdLahan = Lahan::orderBy('lahan_no','desc')->first(); 
        if($getLastIdLahan){
            $lahan_no = '10_'.str_pad(((int)substr($getLastIdLahan->lahan_no,-10) + 1), 10, '0', STR_PAD_LEFT);
        }else{
            $lahan_no = '10_0000000001';
        }
        if (isset($request->test_api)){
            $getExistingMainPivot = DB::table('main_pivots')->where(['type' => 'farmer_lahan', 'key1' => $request->farmer_no, 'key2' => $lahan_no, 'program_year' => $request->year])->get();
            return response()->json(['test_res' => $getExistingMainPivot], 200);
        }
     }
    public function AddMandatoryLahan(Request $request){
        try{
            $validator = Validator::make($request->all(), [                
                'document_no' => 'required|max:255',
                'type_sppt' => 'required',
                'land_area' => 'required',
                'longitude' => 'required',
                'latitude' => 'required',
                'village' => 'required|max:255',
                'target_area' => 'required|max:255',
                'mu_no' => 'required|max:255',
                'active' => 'required|max:1',
                'farmer_no' => 'required',
                'user_id' => 'required',
                'fertilizer' => 'required|max:255',
                'pesticide' => 'required|max:255',
                'sppt' => 'required',
                'list_polygon' => 'required',
                'project_no' => 'required',
                'program_year' => 'required',
            ]);

            if($validator->fails()){
                $rslt =  $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
                return response()->json($rslt, 400);
            }else{
                $coordinate = $this->getCordinate($request->longitude, $request->latitude);
    
                $getLastIdLahan = Lahan::orderBy('lahan_no','desc')->first(); 
                if($getLastIdLahan){
                    $lahan_no = '10_'.str_pad(((int)substr($getLastIdLahan->lahan_no,-10) + 1), 10, '0', STR_PAD_LEFT);
                }else{
                    $lahan_no = '10_0000000001';
                }
                if (isset($request->test_api)){
                    $getExistingMainPivot = DB::table('main_pivots')->where(['type' => 'farmer_lahan', 'key1' => $request->farmer_no, 'key2' => $lahan_no, 'program_year' => $request->year])->get();
                    return response()->json(['test_res' => $getExistingMainPivot], 200);
                }
    
                $getDesa = Desa::select('kode_desa','name','kode_kecamatan')->where('kode_desa','=',$request->village)->first(); 
                $getKec = Kecamatan::select('kode_kecamatan','name','kabupaten_no')->where('kode_kecamatan','=',$getDesa->kode_kecamatan)->first(); 
                $getKab = Kabupaten::select('kabupaten_no','name','province_code')->where('kabupaten_no','=',$getKec->kabupaten_no)->first(); 
                $getProv = Province::select('province_code','name')->where('province_code','=',$getKab->province_code)->first();
                
                $codeempintern = '';
                $internal_code = '-';
                if($request->type_sppt == 1){
                    if($request->user_id){
                        $getUser = User::select('employee_no','role','name')->where('employee_no','=',$request->user_id)->first(); 
                        if($getUser->role == 'ff'){
                            $getUserFF = DB::table('field_facilitators')->where('ff_no','=',$getUser->employee_no)->first();
                            $codeempintern = $getUserFF->fc_no;
                        }else{
                            $codeempintern = $getUser->employee_no;
                        }
                    }
                    $ss = substr($codeempintern,0,2);
                    $tt = str_replace(".","",$getDesa->kode_desa);
                    $getLastInternalCodeLahan = Lahan::orderBy('lahan_no','desc')->first(); 
                    if($getLastInternalCodeLahan){
                        $internal_code = $ss.$tt.str_pad(((int)substr($getLastInternalCodeLahan->internal_code,-4) + 1), 4, '0', STR_PAD_LEFT);
                    }else{
                        $internal_code = $ss.$tt.'00001';
                    }
                }
    
                $description = $this->ReplaceNull($request->description, 'string');
                $photo1 = $this->ReplaceNull($request->photo1, 'string');
                $access_to_water_sources = $this->ReplaceNull($request->access_to_water_sources, 'string');
                $access_to_lahan = $this->ReplaceNull($request->access_to_lahan, 'string');
                $water_availability = $this->ReplaceNull($request->water_availability, 'string');
                $jarak_lahan = $this->ReplaceNull($request->jarak_lahan, 'string');
                $project_no = $this->ReplaceNull($request->project_no, 'string');
    
                $complete_data = 0;
                if($description != "-" && $photo1 != "-" && $access_to_water_sources != "-" && $access_to_lahan != "-" && $jarak_lahan != "-"  && $water_availability != "-" && $project_no != "-")
                {
                    $complete_data = 1;
                }
                
                
    
                Lahan::create([
                    'lahan_no' => $lahan_no,
                    'barcode' => $lahan_no,
                    'document_no' => $request->document_no,
                    'internal_code' => $internal_code,
                    'land_area' => $request->land_area,
                    'longitude' => $request->longitude,
                    'latitude' => $request->latitude,
                    'coordinate' => $coordinate,
                    'village' => $request->village,
                    'kecamatan' => $getKec->kode_kecamatan,
                    'city' => $getKab->kabupaten_no,
                    'province' => $getProv->province_code,
                    'mu_no' => $request->mu_no,
                    'target_area' => $request->target_area,
                    'active' => $request->active,
                    'farmer_no' => $request->farmer_no,
                    'user_id' => $request->user_id,
                    'fertilizer' => $request->fertilizer,
                    'pesticide' => $request->pesticide,
                    'sppt' => $request->sppt,
                    'created_at'=>Carbon::now(),
                    'updated_at'=>Carbon::now(),
                    'polygon_from_ff'=> $this->ReplaceNull($request->polygon_from_ff, 'string'),
    
                    'planting_area' => $this->ReplaceNull($request->planting_area, 'int'),
                    'polygon' => $this->ReplaceNull($request->polygon, 'string'),
                    'description' => $this->ReplaceNull($request->description, 'string'),
                    'elevation' => $this->ReplaceNull($request->elevation, 'string'),
                    'lahan_type' => $this->ReplaceNull($request->lahan_type, 'string'),
                    'soil_type' => $this->ReplaceNull($request->soil_type, 'string'),
                    'exposure' => $this->ReplaceNull($request->exposure, 'string'),
                    'potency' => $this->ReplaceNull($request->potency, 'string'),
                    'current_crops' => $this->ReplaceNull($request->current_crops, 'string'),
                    'tutupan_lahan' => $this->ReplaceNull($request->tutupan_lahan, 'string'),
                    'photo1' => $this->ReplaceNull($request->photo1, 'string'),
                    'photo2' => $this->ReplaceNull($request->photo2, 'string'),
                    'photo3' => $this->ReplaceNull($request->photo3, 'string'),
                    'photo4' => $this->ReplaceNull($request->photo4, 'string'),
                    'group_no' => $this->ReplaceNull($request->group_no, 'string'),
                    'kelerengan_lahan' => $this->ReplaceNull($request->kelerengan_lahan, 'string'),
                    
                    'soil_photo' => $this->ReplaceNull($request->soil_photo, 'string'),
                    'animal_protected_habitat' => $this->ReplaceNull($request->animal_protected_habitat, 'string'),
                    'animal_protected_habitat_distance' => $this->ReplaceNull($request->animal_protected_habitat_distance, 'string'),
                    
                    'access_to_water_sources' => $access_to_water_sources,
                    'access_to_lahan' => $access_to_lahan,
                    'jarak_lahan' => $jarak_lahan,
                    'water_availability' => $water_availability,
    
                    'complete_data' =>$complete_data,
                    'is_dell' => 0
                ]);
                
                if ($request->year != null) {
                    MainPivot::create([
                        'type' => 'farmer_lahan',
                        'key1' => $request->farmer_no,
                        'key2' => $lahan_no,
                        'program_year' => $request->year
                    ]);
                }
                LahanProject::create([
                        'lahan_no' => $lahan_no,
                        'project_no' => $req->project_no,
                        'program_year' => $req->program_year,
                        'created_at'=>Carbon::now(),
                        'updated_at'=>Carbon::now()
                    ]);
                    
                if(isset($req->device_information)){
                    foreach($req->device_information as $di){
                        
                    }
                }
                $order = 1;
                if(isset($req->list_polygon)){
                    foreach($req->list_polygon as $polygon){
                         LahanPolygon::create([
                            'lahan_no' => $lahan_no,
                            'latitude' => $polygon['latitude'],
                            'longitude' => $polygon['longitude'],
                            'order' => $order++,
                            'created_at'=>Carbon::now(),
                            'updated_at'=>Carbon::now()
                        ]);
                    }
                    DB::commit();
                }
                
                
                
                
                // create Lahan Log
                $logData = [
                    'status' => 'Created',
                    'lahan_no' => $lahan_no,
                ];
                $this->createLogs($logData);
                
                $rslt =  $this->ResultReturn(200, 'success', 'success');
                return response()->json($rslt, 200); 
                
            }

        }catch (\Exception $ex){
            return response()->json($ex);
        }
    }
    
    public function addMandatoryLahan_test(Request $req){
        $validator = Validator::make($request->all(), [       
                'lahan_no' => 'required',
                'list_polygon' => 'required',
                'project_no' => 'required',
                'program_year' => 'required',
            ]);

            if($validator->fails()){
                $rslt =  $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
                return response()->json($rslt, 400);
            }else{
                LahanProject::create([
                        'lahan_no' => $req->lahan_no,
                        'project_no' => $req->project_no,
                        'program_year' => $req->program_year,
                        'created_at'=>Carbon::now(),
                        'updated_at'=>Carbon::now()
                    ]);
                $order = 1;
                foreach($req->list_polygon as $polygon){
                     LahanPolygon::create([
                        'lahan_no' => $polygon['lahan_no'],
                        'latitude' => $polygon['latitude'],
                        'longitude' => $polygon['longitude'],
                        'order' => $polygon['order'],
                        'created_at'=>Carbon::now(),
                        'updated_at'=>Carbon::now()
                    ]);
                }
                DB::commit();
            }
    }

    /**
     * @SWG\Post(
     *   path="/api/AddMandatoryLahanComplete",
	 *   tags={"Lahan"},
     *   security={
	 *     {"apiAuth": {}},
	 *   },
     *   summary="Add Mandatory Lahan Complete",
     *   operationId="AddMandatoryLahanComplete",
     *   @SWG\Response(response=200, description="successful operation"),
     *   @SWG\Response(response=401, description="Unauthenticated"),
     *   @SWG\Response(response=404, description="Not Found"),
     *   @SWG\Response(response=500, description="internal server error"),
	 *		@SWG\Parameter(
     *          name="Parameters",
     *          in="body",
	 *			description="Add Mandatory Lahan Complete",
     *          required=true, 
     *          type="string",
	 *   		@SWG\Schema(
     *              @SWG\Property(property="lahan_no", type="string", example="10_000000002"),
     *              @SWG\Property(property="document_no", type="string", example="0909090909"),
     *              @SWG\Property(property="type_sppt", type="integer", example=1),
     *              @SWG\Property(property="land_area", type="string", example="8200.00"),
     *              @SWG\Property(property="longitude", type="date", example="110.3300613"),
     *              @SWG\Property(property="latitude", type="string", example="-7.580778"),
     *              @SWG\Property(property="village", type="string", example="33.05.10.18"),
     *              @SWG\Property(property="mu_no", type="string", example="025"),
     *              @SWG\Property(property="target_area", type="string", example="025001"),
     *              @SWG\Property(property="farmer_no", type="string", example="F00000001"),
     *              @SWG\Property(property="fertilizer", type="string", example="Kimia"),   
     *              @SWG\Property(property="pesticide", type="string", example="Kimia"),
     *              @SWG\Property(property="sppt", type="string", example="File"),
     *              @SWG\Property(property="active", type="int", example="1"),
     *              @SWG\Property(property="user_id", type="string", example="U0002")
     *          ),
     *      )
     * )
     *
     */
    public function AddMandatoryLahanComplete(Request $request){
        try{
            $validator = Validator::make($request->all(), [                
                'lahan_no' => 'required|max:255|unique:lahans',
                'type_sppt' => 'required',
                'land_area' => 'required',
                'longitude' => 'required',
                'latitude' => 'required',
                'village' => 'required',
                'target_area' => 'required',
                'mu_no' => 'required',
                'active' => 'required|max:1',
                'farmer_no' => 'required',
                'user_id' => 'required',
                'fertilizer' => 'required',
                'pesticide' => 'required',
                'sppt' => 'required',
            ]);

            if($validator->fails()){
                $rslt =  $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
                return response()->json($rslt, 400);
            }

            $coordinate = $this->getCordinate($request->longitude, $request->latitude);

            // $getLastIdLahan = Lahan::orderBy('lahan_no','desc')->first(); 
            // if($getLastIdLahan){
            //     $lahan_no = '10_'.str_pad(((int)substr($getLastIdLahan->lahan_no,-10) + 1), 10, '0', STR_PAD_LEFT);
            // }else{
            //     $lahan_no = '10_0000000001';
            // }

            $getDesa = Desa::select('kode_desa','name','kode_kecamatan')->where('kode_desa','=',$request->village)->first(); 
            $getKec = Kecamatan::select('kode_kecamatan','name','kabupaten_no')->where('kode_kecamatan','=',$getDesa->kode_kecamatan)->first(); 
            $getKab = Kabupaten::select('kabupaten_no','name','province_code')->where('kabupaten_no','=',$getKec->kabupaten_no)->first(); 
            $getProv = Province::select('province_code','name')->where('province_code','=',$getKab->province_code)->first();
            
            
            $codeempintern = '';
            $internal_code = '-';
            if($request->type_sppt != 0){
                // if($request->user_id){
                //     $getUser = User::select('employee_no','role','name')->where('employee_no','=',$request->user_id)->first(); 
                //     if($getUser->role == 'ff'){
                //         $getUserFF = DB::table('field_facilitators')->where('ff_no','=',$getUser->employee_no)->first();
                //         $codeempintern = $getUserFF->fc_no;
                //     }else{
                //         $codeempintern = $getUser->employee_no;
                //     }
                // }
                // $ss = substr($codeempintern,0,2);
                // $tt = str_replace(".","",$getDesa->kode_desa);
                // var_dump($getDesa->kode_desa);
                // var_dump(Carbon::now()->format('Y'));
                // var_dump($request->mu_no);
                // var_dump($request->lahan_no);
                // $barcodestring = str.substring(3, 13) ;
                // var_dump($barcodestring);

                $tt = $getDesa->kode_desa;
                $year = Carbon::now()->format('Y');
                $mu = $request->mu_no;
                $str = $request->lahan_no;
                $barcodestring = substr($str,3, 13) ;

                $internal_code = $tt.$year.$mu.$barcodestring;

                
                // var_dump($internal_code);

                // $getLastInternalCodeLahan = Lahan::orderBy('lahan_no','desc')->first(); 
                // if($getLastInternalCodeLahan){
                //     $internal_code = $tt.str_pad(((int)substr($getLastInternalCodeLahan->internal_code,-10) + 1), 10, '0', STR_PAD_LEFT);
                // }else{
                //     $internal_code = $tt.'0000000001';
                // }
            }
            // var_dump('test');
            $description = $this->ReplaceNull($request->description, 'string');
            $photo1 = $this->ReplaceNull($request->photo1, 'string');
            $access_to_water_sources = $this->ReplaceNull($request->access_to_water_sources, 'string');
            $access_to_lahan = $this->ReplaceNull($request->access_to_lahan, 'string');
            $water_availability = $this->ReplaceNull($request->water_availability, 'string');
            $jarak_lahan = $this->ReplaceNull($request->jarak_lahan, 'string');

            $complete_data = 0;
            if($description != "-" && $photo1 != "-" && $access_to_water_sources != "-" && $access_to_lahan != "-" && $jarak_lahan != "-"  && $water_availability != "-")
            {
                $complete_data = 1;
            }

            // var_dump($request->lahan_no);
            Lahan::create([
                'lahan_no' => $request->lahan_no,
                'barcode' => $request->lahan_no,
                'document_no' => $request->document_no,
                'internal_code' => $internal_code,
                'land_area' => $request->land_area,
                'longitude' => $request->longitude,
                'latitude' => $request->latitude,
                'coordinate' => $coordinate,
                'village' => $request->village,
                'kecamatan' => $getKec->kode_kecamatan,
                'city' => $getKab->kabupaten_no,
                'province' => $getProv->province_code,
                'mu_no' => $request->mu_no,
                'target_area' => $request->target_area,
                'active' => $request->active,
                'farmer_no' => $request->farmer_no,
                'farmer_temp' => $this->ReplaceNull($request->farmer_temp, 'string'),
                'user_id' => $request->user_id,
                'fertilizer' => $request->fertilizer,
                'pesticide' => $request->pesticide,
                'sppt' => $request->sppt,
                'created_at'=>Carbon::now(),
                'updated_at'=>Carbon::now(),

                'planting_area' => $this->ReplaceNull($request->planting_area, 'int'),
                'polygon' => $this->ReplaceNull($request->polygon, 'string'),
                'description' => $this->ReplaceNull($request->description, 'string'),
                'elevation' => $this->ReplaceNull($request->elevation, 'string'),
                'lahan_type' => $this->ReplaceNull($request->lahan_type, 'string'),
                'soil_type' => $this->ReplaceNull($request->soil_type, 'string'),
                'soil_photo' => $this->ReplaceNull($request->soil_photo, 'string'),
                'exposure' => $this->ReplaceNull($request->exposure, 'string'),
                'potency' => $this->ReplaceNull($request->potency, 'string'),
                'current_crops' => $this->ReplaceNull($request->current_crops, 'string'),
                'tutupan_lahan' => $this->ReplaceNull($request->tutupan_lahan, 'string'),
                'photo1' => $this->ReplaceNull($request->photo1, 'string'),
                'photo2' => $this->ReplaceNull($request->photo2, 'string'),
                'photo3' => $this->ReplaceNull($request->photo3, 'string'),
                'photo4' => $this->ReplaceNull($request->photo4, 'string'),
                'group_no' => $this->ReplaceNull($request->group_no, 'string'),
                'kelerengan_lahan' => $this->ReplaceNull($request->kelerengan_lahan, 'string'),

                'access_to_water_sources' => $access_to_water_sources,
                'access_to_lahan' => $access_to_lahan,
                'jarak_lahan' => $jarak_lahan,
                'water_availability' => $water_availability,

                // 'opsi_pola_tanam' => $this->ReplaceNull($request->opsi_pola_tanam, 'string'),
                // 'pohon_kayu' => $this->ReplaceNull($request->pohon_kayu, 'string'),
                // 'pohon_mpts' => $this->ReplaceNull($request->pohon_mpts, 'string'),
                // 'type_sppt' => $this->ReplaceNull($request->type_sppt, 'int'),

                'complete_data' =>$complete_data,
                'is_dell' => 0
            ]);
            
            // LahanTutupan::create([
            //     'lahan_no' => $request->lahan_no,
            //     'land_area' => $this->ReplaceNull($request->land_area, 'int'),
            //     'planting_area' => $this->ReplaceNull($request->planting_area, 'int'),
            //     'planting_year' => $year,
            //     'sisa_luasan' => null,
            //     'percentage_sisa_luasan' => null,
            //     'created_at'=>Carbon::now(),
            //     'updated_at'=>Carbon::now()
            // ]);
            
            
            // create Lahan Log
            $logData = [
                'status' => 'Created',
                'lahan_no' => $request->lahan_no,
            ];
            $this->createLogs($logData);
            
            $rslt =  $this->ResultReturn(200, 'success', 'success');
            return response()->json($rslt, 200); 
        }catch (\Exception $ex){
            return response()->json($ex);
        }
    }
    
    
    public function UpdateLahanStatusForceMajeure(Request $request){
      $validator = Validator::make($request->all(), [
            'lahan_no' => 'required'  
        ]); 
        if($validator->fails()){
            $rslt =  $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
                return response()->json($rslt, 400);
        }
        Lahan::where('lahan_no', '=' ,$request->lahan_no)->update([
            'latest_condition' => 'force-majeure',
            'approve' => '3',
            'status' => '0'
        ]);
        $rslt =  $this->ResultReturn(200, 'success', 'success');
            return response()->json($rslt, 200); 
            
    }

    /**
     * @SWG\Post(
     *   path="/api/VerificationLahan",
	 *   tags={"Lahan"},
     *   security={
	 *     {"apiAuth": {}},
	 *   },
     *   summary="Verification Lahan",
     *   operationId="VerificationLahan",
     *   @SWG\Response(response=200, description="successful operation"),
     *   @SWG\Response(response=401, description="Unauthenticated"),
     *   @SWG\Response(response=404, description="Not Found"),
     *   @SWG\Response(response=500, description="internal server error"),
	 *		@SWG\Parameter(
     *          name="Parameters",
     *          in="body",
	 *			description="Verification Lahan",
     *          required=true, 
     *          type="string",
	 *   		@SWG\Schema(
     *              @SWG\Property(property="id", type="string", example="2")
     *          ),
     *      )
     * )
     *
     */
    public function VerificationLahan(Request $request){
        try{
            $validator = Validator::make($request->all(), [    
                'id' => 'required'
            ]);

            if($validator->fails()){
                $rslt =  $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
                return response()->json($rslt, 400);
            }
            Lahan::where('id', '=', $request->id)
                    ->update
                    ([
                        'complete_data' => 1,
                        'approve' => 1,
                    ]);
            
            
            // create Lahan Log
            $logData = [
                'status' => 'Verified',
                'lahan_no' => Lahan::where('id', '=', $request->id)->first()->lahan_no ?? '999999999999999999',
            ];
            $this->createLogs($logData);
            
            $rslt =  $this->ResultReturn(200, 'success', 'success');
            return response()->json($rslt, 200); 
        }catch (\Exception $ex){
            return response()->json($ex);
        }
    }
    
    public function UnverificationLahan(Request $req){
        $validator = Validator::make($req->all(), [    
            'lahan_no' => 'required|exists:lahans,lahan_no',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors()->first(), 400);
        } else {
            // Lahan
            $lahan = DB::table('lahans')->where('lahan_no', $req->lahan_no)->first();
            if ($lahan) {
                $py = date('Y', strtotime($lahan->created_time));
                $lahanBibit = DB::table('lahan_details')->where('lahan_no', $lahan->lahan_no)->get();
                $farmer = DB::table('farmers')->where('farmer_no', $lahan->farmer_no)->first();
                $farmerLahan = DB::table('lahans')->where('farmer_no', $lahan->farmer_no)->pluck('lahan_no');
                $ff = DB::table('field_facilitators')->where('ff_no', $lahan->user_id)->first();
                $fc = DB::table('employees')->where('nik', $ff->fc_no)->first();
                // Create Log
                $logData = [
                    'status' => 'Unverified',
                    'lahan_no' => $req->lahan_no,
                ];
                $this->createLogs($logData);
                // Update Data
                Lahan::where('lahan_no', $req->lahan_no)->update(['approve' => 0]);
            } else return response()->json('Lahan not found.', 404);
            // Sosialisasi Tanam 
            $sostam = DB::table('planting_socializations')->where(['no_lahan' => $lahan->lahan_no, 'planting_year' => $py])->first();
            if ($sostam) {
                $sostamBibit = DB::table('planting_details')->where('form_no', $sostam->form_no)->get();
                $sostamPeriod = DB::table('planting_period')->where('form_no', $sostam->form_no)->first();
                // Create Log
                $sostamLog = "Deleted $sostam->form_no [lahan=$lahan->lahan_no, petani=$farmer->farmer_no-$farmer->name-$farmer->nickname, ff=$ff->ff_no-$ff->name, fc=$fc->nik-$fc->name] by " . (Auth::user()->email ?? '-');
                Log::channel('planting_socializations')->alert($sostamLog);
                // Delete Data
                DB::table('planting_socializations')->where(['no_lahan' => $lahan->lahan_no, 'planting_year' => $py])->delete();
                DB::table('planting_details')->where('form_no', $sostam->form_no)->delete();
                DB::table('planting_period')->where('form_no', $sostam->form_no)->delete();
            }
            // Penilikan Lubang
            $penlub = DB::table('planting_hole_surviellance')->where(['lahan_no' => $lahan->lahan_no, 'planting_year' => $py])->first();
            if ($penlub) {
                $penlubBibit = DB::table('planting_hole_details')->where('ph_form_no', $penlub->ph_form_no)->get();
                // Create Log
                $penlubLog = "Deleted $penlub->ph_form_no [lahan=$lahan->lahan_no, petani=$farmer->farmer_no-$farmer->name-$farmer->nickname, ff=$ff->ff_no-$ff->name, fc=$fc->nik-$fc->name] by " . (Auth::user()->email ?? '-');
                Log::channel('planting_holes')->alert($penlubLog);
                // Update is Checked PH other land in farmer
                DB::table('planting_hole_surviellance')->whereIn('lahan_no', $farmerLahan)->where(['planting_year' => $py])->update(['is_checked' => 0]);
                // Delete Data
                DB::table('planting_hole_surviellance')->where(['lahan_no' => $lahan->lahan_no, 'planting_year' => $py])->delete();
                DB::table('planting_hole_surviellance')->where(['lahan_no' => $lahan->lahan_no, 'planting_year' => $py])->delete();
                DB::table('planting_hole_details')->where('ph_form_no', $penlub->ph_form_no)->delete();
            }
            // Material Organic
            $organic = DB::table('organics')->where(['farmer_no' => $lahan->farmer_no, ['organic_no', 'LIKE', '%-' . $py . '-%']])->get();
            if (count($organic) > 0) {
                $organicLog = [];
                foreach ($organic as $org) {
                    // Create Log
                    $organicLogMessage = "Deleted $org->organic_no - $org->organic_name [petani=$farmer->farmer_no-$farmer->name-$farmer->nickname, ff=$ff->ff_no-$ff->name, fc=$fc->nik-$fc->name] by " . (Auth::user()->email ?? '-');
                    Log::channel('material_organics')->alert($organicLogMessage);
                    array_push($organicLog, $organicLogMessage);
                }
                // Delete Data
                DB::table('organics')->where(['farmer_no' => $lahan->farmer_no, ['organic_no', 'LIKE', '%-' . $py . '-%']])->delete();
            }
            // Distribusi
            $distribusi = DB::table('distributions')->where(['farmer_no' => $lahan->farmer_no, ['distribution_no', 'LIKE', 'D-'.$py.'-%']])->first();
            if ($distribusi) {
                $distribusiLabel = DB::table('distribution_details')->where('distribution_no', $distribusi->distribution_no)->get();
                $distribusiAdjustment = DB::table('distribution_adjustments')->where('distribution_no', $distribusi->distribution_no)->get();
                // Create Log
                $distribusiLog = "Deleted $distribusi->distribution_no [petani=$farmer->farmer_no-$farmer->name-$farmer->nickname, ff=$ff->ff_no-$ff->name, fc=$fc->nik-$fc->name] by " . (Auth::user()->email ?? '-');
                Log::channel('distributions')->alert($distribusiLog);
                // Delete Data
                DB::table('distributions')->where(['farmer_no' => $lahan->farmer_no, ['distribution_no', 'LIKE', 'D-'.$py.'-%']])->delete();
                DB::table('distribution_details')->where('distribution_no', $distribusi->distribution_no)->delete();
                DB::table('distribution_adjustments')->where('distribution_no', $distribusi->distribution_no)->delete();
            }
            // Realisasi Tanam
            $mon1 = DB::table('monitorings')->where(['planting_year' => $py, 'farmer_no' => $lahan->farmer_no])->first();
            if ($mon1) {
                $mon1Bibit = DB::table('monitoring_details')->where('monitoring_no', $mon1->monitoring_no)->get();
                // Create Log
                $mon1Log = "Deleted $mon1->monitoring_no [lahan=$mon1->lahan_no, petani=$farmer->farmer_no-$farmer->name-$farmer->nickname, ff=$ff->ff_no-$ff->name, fc=$fc->nik-$fc->name] by " . (Auth::user()->email ?? '-');
                Log::channel('monitoring_1')->alert($mon1Log);
                // Delete Data
                DB::table('monitorings')->where(['planting_year' => $py, 'farmer_no' => $lahan->farmer_no])->delete();
                DB::table('monitoring_details')->where('monitoring_no', $mon1->monitoring_no)->delete();
            }
            
            $datas = (object)[
                'program_year' => $py,
                'lahan' => (object)[
                    'main' => $lahan,
                    'bibit' => $lahanBibit,
                ],
                'sostam' => (object)[
                    'main' => $sostam,
                    'bibit' => $sostamBibit ?? [],
                    'period' => $sostamPeriod ?? '',
                    'log' => $sostamLog ?? '-'
                ],
                'penlub' => (object)[
                    'main' => $penlub,
                    'bibit' => $penlubBibit ?? [],
                    'log' => $penlubLog ?? '-'
                ],
                'material_organic' => (object)[
                    'data' => $organic,
                    'log' => $organicLog ?? '-'
                ],
                'distribusi' => (object)[
                    'main' => $distribusi,
                    'label' => $distribusiLabel ?? [],
                    'adjustment' => $distribusiAdjustment ?? [],
                    'log' => $distribusiLog ?? '-'
                ],
                'mon1' => (object)[
                    'main' => $mon1,
                    'bibit' => $mon1Bibit ?? [],
                    'log' => $mon1Log ?? '-'
                ],
            ];
            return response()->json($datas, 200);
        }
    }

    /**
     * @SWG\Post(
     *   path="/api/AddMandatoryLahanBarcode",
	 *   tags={"Lahan"},
     *   security={
	 *     {"apiAuth": {}},
	 *   },
     *   summary="Add Mandatory Lahan Barcode",
     *   operationId="AddMandatoryLahanBarcode",
     *   @SWG\Response(response=200, description="successful operation"),
     *   @SWG\Response(response=401, description="Unauthenticated"),
     *   @SWG\Response(response=404, description="Not Found"),
     *   @SWG\Response(response=500, description="internal server error"),
	 *		@SWG\Parameter(
     *          name="Parameters",
     *          in="body",
	 *			description="Add Mandatory Lahan Barcode",
     *          required=true, 
     *          type="string",
	 *   		@SWG\Schema(
     *              @SWG\Property(property="user_id", type="string", example="U0001"),
     *              @SWG\Property(property="farmer_no", type="string", example="F00000001"),
     *              @SWG\Property(property="farmer_temp", type="string", example="bambang"),
     *              @SWG\Property(property="barcode", type="string", example="L0000001"),
     *              @SWG\Property(property="longitude", type="string", example="110.3300613"),
     *              @SWG\Property(property="latitude", type="string", example="-7.580778")
     *          ),
     *      )
     * )
     *
     */
    public function AddMandatoryLahanBarcode(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'user_id' => 'required',
                'farmer_temp' => 'required', 
                'farmer_no' => 'required', 
                'barcode' => 'required|max:255|unique:lahans',
                'longitude' => 'required|max:255',
                'latitude' => 'required|max:255'
            ]);

            if($validator->fails()){
                $rslt =  $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
                return response()->json($rslt, 400);
            }

            $coordinate = $this->getCordinate($request->longitude, $request->latitude);

            $kec= '-';
            $city= '-';
            $province= '-';

            if($request->village){
                $getDesa = Desa::select('kode_desa','name','kode_kecamatan')->where('kode_desa','=',$request->village)->first(); 
                $getKec = Kecamatan::select('kode_kecamatan','name','kabupaten_no')->where('kode_kecamatan','=',$getDesa->kode_kecamatan)->first(); 
                $getKab = Kabupaten::select('kabupaten_no','name','province_code')->where('kabupaten_no','=',$getKec->kabupaten_no)->first(); 
                $getProv = Province::select('province_code','name')->where('province_code','=',$getKab->province_code)->first();
            
                $kec = $getKec->kode_kecamatan;
                $city = $getKab->kabupaten_no;
                $province = $getProv->province_code; 
            }
            


            $codeempintern = '';
            $internal_code = '-';
            if($request->type_sppt){
                if($request->type_sppt == 1 || $request->type_sppt == 2 || $request->type_sppt == 3){

                    $tt = $getDesa->kode_desa;
                    $year = Carbon::now()->format('Y');
                    $mu = $request->mu_no;
                    $str = $request->barcode;
                    $barcodestring = substr($str,3, 13) ;

                    $internal_code = $tt.$year.$mu.$barcodestring;

                }
            }

            // if($request->user_id == "02320210001" || $request->user_id == "FF00001602"){
                Lahan::create([
                    'lahan_no' => $request->barcode,
                    'longitude' => $request->longitude,
                    'latitude' => $request->latitude,
                    'coordinate' => $coordinate,
                    'barcode' => $request->barcode,
                    'farmer_temp' => $request->farmer_temp,
                    'farmer_no' => $request->farmer_no,
                    'user_id' => $request->user_id,
    
                    'internal_code' => $internal_code,
    
                    'document_no' => $this->ReplaceNull($request->document_no, 'string'),
                    'land_area' => $this->ReplaceNull($request->land_area, 'int'),                
                    'village' => $this->ReplaceNull($request->village, 'string'),
                    'kecamatan' => $kec,
                    'city' => $city,
                    'province' => $province,
                    'mu_no' => $this->ReplaceNull($request->mu_no, 'string'),
                    'target_area' => $this->ReplaceNull($request->target_area, 'string'),
                    'active' => $this->ReplaceNull($request->active, 'int'),
                    // 'farmer_no' => $this->ReplaceNull($request->farmer_no, 'string'),                
                    'fertilizer' => $this->ReplaceNull($request->fertilizer, 'string'),
                    'pesticide' => $this->ReplaceNull($request->pesticide, 'string'),
                    'sppt' => $this->ReplaceNull($request->sppt, 'string'),
                    'created_time' => $request->created_time,
                    'created_at'=>Carbon::now(),
                    'updated_at'=>Carbon::now(),
    
                    'planting_area' => $this->ReplaceNull($request->planting_area, 'int'),
                    'polygon' => $this->ReplaceNull($request->polygon, 'string'),
                    'description' => $this->ReplaceNull($request->description, 'string'),
                    'elevation' => $this->ReplaceNull($request->elevation, 'string'),
                    'soil_type' => $this->ReplaceNull($request->soil_type, 'string'),
                    'soil_photo' => $this->ReplaceNull($request->soil_photo, 'string'),
                    'current_crops' => $this->ReplaceNull($request->current_crops, 'string'),
                    'tutupan_lahan' => $this->ReplaceNull($request->tutupan_lahan, 'string'),
                    'photo1' => $this->ReplaceNull($request->photo1, 'string'),
                    'photo2' => $this->ReplaceNull($request->photo2, 'string'),
                    'photo3' => $this->ReplaceNull($request->photo3, 'string'),
                    'photo4' => $this->ReplaceNull($request->photo4, 'string'),
                    'group_no' => $this->ReplaceNull($request->group_no, 'string'),
                    'kelerengan_lahan' => $this->ReplaceNull($request->kelerengan_lahan, 'string'),
                    'access_to_water_sources' => $this->ReplaceNull($request->access_to_water_sources, 'string'),
                    'access_to_lahan' => $this->ReplaceNull($request->access_to_lahan, 'string'),
                    'lahan_type' => $this->ReplaceNull($request->lahan_type, 'string'),
                    
                    // 'access_to_water_sources' => $access_to_water_sources,
                    // 'access_to_lahan' => $access_to_lahan,
                    'jarak_lahan' =>$this->ReplaceNull($request->jarak_lahan, 'string'),
                    'water_availability' => $this->ReplaceNull($request->water_availability, 'string'),
    
                    'opsi_pola_tanam' => $this->ReplaceNull($request->opsi_pola_tanam, 'string'),
                    'pohon_kayu' => $this->ReplaceNull($request->pohon_kayu, 'int'),
                    'pohon_mpts' => $this->ReplaceNull($request->pohon_mpts, 'int'),
                    'type_sppt' => $this->ReplaceNull($request->type_sppt, 'int'),
                    
                    //NEW
                    
                    'nearby_village' => $this->ReplaceNull($request->nearby_village, 'int'), //boolean 0/1
                    'nearby_village_distance' => $this->ReplaceNull($request->nearby_village_distance, 'int'), //in kilometers
                    'tutupan_pohon_percentage' => $this->ReplaceNull($request->tutupan_pohon_percentage, 'int'), //Integer 1-100
                    'tutupan_pohon_photo' => $this->ReplaceNull($request->tutupan_pohon_photo, 'string'), //Varchar: file path
                    'tutupan_tanaman_bawah_percentage' => $this->ReplaceNull($request->tutupan_tanaman_bawah_percentage, 'int'), //Integer 1-100
                    'tutupan_tanaman_bawah_photo' => $this->ReplaceNull($request->tutupan_tanaman_bawah_photo, 'string'), //Varchar: file path
                    'tutupan_lain_bangunan_percentage' => $this->ReplaceNull($request->tutupan_lain_bangunan_percentage, 'int'), //Integer 1-100
                    'tutupan_lain_bangunan_photo' => $this->ReplaceNull($request->tutupan_lain_bangunan_photo, 'string'), //Varchar: file path
                    'floods' => $this->ReplaceNull($request->floods, 'int'), //boolean 0/1
                    'wildfire' => $this->ReplaceNull($request->wildfire, 'int'), //boolean 0/1
                    'landslide' => $this->ReplaceNull($request->landslide, 'int'), //boolean 0/1
                    'drought' => $this->ReplaceNull($request->drought, 'int'), //boolean 0/1
                    
                    'animal_protected_habitat' => $this->ReplaceNull($request->animal_protected_habitat, 'string'),//boolean 0/1
                    'animal_protected_habitat_distance' => $this->ReplaceNull($request->animal_protected_habitat_distance, 'string'),
                    
                    'polygon_from_ff' => $this->ReplaceNull($request->polygon_from_ff, 'string'), //Varchar: file path
                    'water_availability_level' => $this->ReplaceNull($request->water_availability_level, 'int'), //boolean 0/1/2
                    'gps_accuration' => $this->ReplaceNull($request->gps_accuration, 'int'),
                    
                    'is_dell' => 0
                ]);
                
                $document_no = $this->ReplaceNull($request->document_no, 'string');
                $land_area = $this->ReplaceNull($request->land_area, 'int');
                $village = $this->ReplaceNull($request->village, 'string');
                $mu_no = $this->ReplaceNull($request->mu_no, 'string');
                $target_area = $this->ReplaceNull($request->target_area, 'string');
    
                $fertilizer = $this->ReplaceNull($request->fertilizer, 'string');
                $pesticide = $this->ReplaceNull($request->pesticide, 'string');
                $sppt = $this->ReplaceNull($request->sppt, 'string');
    
                $description = $this->ReplaceNull($request->description, 'string');
                $photo1 = $this->ReplaceNull($request->photo1, 'string');
                $photo2 = $this->ReplaceNull($request->photo2, 'string');
                $photo3 = $this->ReplaceNull($request->photo3, 'string');
                $photo4 = $this->ReplaceNull($request->photo4, 'string');
    
                $group_no = $this->ReplaceNull($request->group_no, 'string');
                $planting_area = $this->ReplaceNull($request->planting_area, 'int');
                $polygon = $this->ReplaceNull($request->polygon, 'string');
                $elevation = $this->ReplaceNull($request->elevation, 'string');
                $soil_type = $this->ReplaceNull($request->soil_type, 'string');
                $soil_photo = $this->ReplaceNull($request->soil_photo, 'string');
                $current_crops = $this->ReplaceNull($request->current_crops, 'string');
                $tutupan_lahan = $this->ReplaceNull($request->tutupan_lahan, 'string');
                $kelerengan_lahan = $this->ReplaceNull($request->kelerengan_lahan, 'string');
    
                $access_to_water_sources = $this->ReplaceNull($request->access_to_water_sources, 'string');
                $access_to_lahan = $this->ReplaceNull($request->access_to_lahan, 'string');
                $water_availability = $this->ReplaceNull($request->water_availability, 'string');
                $lahan_type = $this->ReplaceNull($request->lahan_type, 'string');
                $potency = $this->ReplaceNull($request->potency, 'string');
                $jarak_lahan = $this->ReplaceNull($request->jarak_lahan, 'string');
                $exposure = $this->ReplaceNull($request->exposure, 'string');
                $project = $this->ReplaceNull($request->project_no, 'string');
    
                if($document_no != "-" &&$land_area != 0 &&$village != "-" &&$project != "-" && $fertilizer != "-" && $pesticide != "-" && $description != "-" &&  $access_to_water_sources != "-" && $access_to_lahan != "-" && $jarak_lahan != "-"  && $water_availability != "-")
                {
                    Lahan::where('lahan_no', '=', $request->lahan_no)
                    ->update
                    (['complete_data' => 1]);
                }
                
                if ($request->year != null) {
                    MainPivot::create([
                        'type' => 'farmer_lahan',
                        'key1' => $request->farmer_no,
                        'key2' => $request->barcode,
                        'active' => 1,
                        'program_year' => $request->year
                    ]);
                    
                    LahanTutupan::create([
                        'lahan_no' => $request->barcode,
                        'land_area' => $request->land_area,
                        'planting_area' => $request->planting_area,
                        'program_year' => $request->year,
                        'tutupan_lahan' => $request->tutupan_lahan,
                        'pattern' => $request->opsi_pola_tanam
                    ]);
                    LahanProject::create([
                        'lahan_no' => $request->barcode,
                        'project_no' => $request->project_no,
                        'program_year' => $request->year,
                        'created_at'=>Carbon::now(),
                        'updated_at'=>Carbon::now()
                    ]);
                    
                    if($request->list_ff_device != "-"){
                        foreach($request->list_ff_device as $device){
                            LahanFFDevice::create([
                                'lahan_no' => $request->barcode,
                                'phone_brand' => $device['phone_brand'],
                                'type_model' => $device['type_model'],
                                'android_version' => $device['android_version'],
                                'ram_total' => $device['ram_total'],
                                'free_ram_spaces' => $device['free_ram_spaces'],
                                'internal_memory' => $device['internal_memory'],
                                'camera_resolution' => $device['camera_resolution'],
                                'censors' => $device['censors'],
                                'created_at' => Carbon::now(),
                                'updated_at' => Carbon::now(),
                                'id_del' => 0
                                ]);
                        }
                    }
                    

                    if($request->list_polygons != "-"){
                        foreach($request->list_polygons as $polygon){
                            LahanPolygon::create([
                                'lahan_no' => $request->barcode,
                                'latitude' => $polygon['latitude'],
                                'longitude' => $polygon['longitude'],
                                'order' => $polygon['sort'],
                                'created_at'=>Carbon::now(),
                                'updated_at'=>Carbon::now()
                            ]);
                        }
                    }
                }
                
                // create Lahan Log
                $logData = [
                    'status' => 'Created',
                    'lahan_no' => $request->barcode,
                ];
                $this->createLogs($logData);
                
                $rslt =  $this->ResultReturn(200, 'success', 'success');
                return response()->json($rslt, 200);
            // }else{
            //     $rslt =  $this->ResultReturn(400, 'Waktu Pendataan Lahan Sudah Selesai', 'Gagal');
            //     return response()->json($rslt, 400);
            // }
        }catch (\Exception $ex){
            return response()->json($ex);
        }
    }

    /**
     * @SWG\Get(
     *   path="/api/GetLahanDetailTrees",
     *   tags={"Lahan"},
     *   security={
	 *     {"apiAuth": {}},
	 *   },
     *   summary="Get Lahan Detail Trees",
     *   operationId="GetLahanDetailTrees",
     *   @SWG\Response(response=200, description="successful operation"),
     *   @SWG\Response(response=401, description="Unauthenticated"),
     *   @SWG\Response(response=500, description="internal server error"),
     *      @SWG\Parameter(name="user_id",in="query", required=true, type="string")
     * )
     */
    public function GetLahanDetailTrees(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'user_id' => 'required|string|max:255'
            ]);
    
            if($validator->fails()){
                $rslt =  $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
                return response()->json($rslt, 400);
            }
            $getDetailTreesLAhan =  DB::table('lahan_details')->select('lahan_details.id','lahan_details.lahan_no','lahan_details.tree_code','lahan_details.amount',
                'lahan_details.detail_year','trees.tree_name')
                ->leftjoin('trees', 'trees.tree_code', '=', 'lahan_details.tree_code')
                ->where('lahan_details.user_id', '=', $request->user_id)
                ->get();
            if($getDetailTreesLAhan){
                $rslt =  $this->ResultReturn(200, 'success', $getDetailTreesLAhan);
                return response()->json($rslt, 200);  
            }
            else{
                $rslt =  $this->ResultReturn(404, 'doesnt match data', 'doesnt match data');
                return response()->json($rslt, 404);
            } 
        }catch (\Exception $ex){
            return response()->json($ex);
        }
    }

    /**
     * @SWG\Post(
     *   path="/api/AddDetailLahan",
	 *   tags={"Lahan"},
     *   security={
	 *     {"apiAuth": {}},
	 *   },
     *   summary="Add Detail Lahan",
     *   operationId="AddDetailLahan",
     *   @SWG\Response(response=200, description="successful operation"),
     *   @SWG\Response(response=401, description="Unauthenticated"),
     *   @SWG\Response(response=404, description="Not Found"),
     *   @SWG\Response(response=500, description="internal server error"),
	 *		@SWG\Parameter(
     *          name="Parameters",
     *          in="body",
	 *			description="Add Detail Lahan",
     *          required=true, 
     *          type="string",
	 *   		@SWG\Schema(
     *              @SWG\Property(property="user_id", type="string", example="U0001"),
     *              @SWG\Property(property="lahan_no", type="string", example="L00000001"),
     *              @SWG\Property(property="tree_code", type="string", example="T0001"),
     *              @SWG\Property(property="amount", type="string", example="50"),
     *              @SWG\Property(property="detail_year", type="string", example="2021-04-20"),
     *          ),
     *      )
     * )
     *
     */
    public function AddDetailLahan(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'lahan_no' => 'required',
                'tree_code' => 'required', 
                'amount' => 'required', 
                'detail_year' => 'required',
                'user_id' => 'required',
            ]);

            if($validator->fails()){
                $rslt =  $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
                return response()->json($rslt, 400);
            }

            // var_dump($coordinate);
            // 'lahan_no', 'tree_code', 'amount', 'detail_year', 'user_id','created_at', 'updated_at'
            LahanDetail::create([
                'lahan_no' => $request->lahan_no,
                'tree_code' => $request->tree_code,
                'amount' => $request->amount,
                'detail_year' => $request->detail_year,
                'user_id' => $request->user_id,

                'created_at'=>Carbon::now(),
                'updated_at'=>Carbon::now()
            ]);
            $rslt =  $this->ResultReturn(200, 'success', 'success');
            return response()->json($rslt, 200); 
        }catch (\Exception $ex){
            return response()->json($ex);
        }
    }

    /**
     * @SWG\Post(
     *   path="/api/DeleteDetailLahan",
	 *   tags={"Lahan"},
     *   security={
	 *     {"apiAuth": {}},
	 *   },
     *   summary="Delete Detail Lahan",
     *   operationId="DeleteDetailLahan",
     *   @SWG\Response(response=200, description="successful operation"),
     *   @SWG\Response(response=401, description="Unauthenticated"),
     *   @SWG\Response(response=404, description="Not Found"),
     *   @SWG\Response(response=500, description="internal server error"),
	 *		@SWG\Parameter(
     *          name="Parameters",
     *          in="body",
	 *			description="Delete Detail Lahan",
     *          required=true, 
     *          type="string",
	 *   		@SWG\Schema(
     *              @SWG\Property(property="id", type="string", example="1")
     *          ),
     *      )
     * )
     *
     */
    public function DeleteDetailLahan(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'id' => 'required'
            ]);
    
            if($validator->fails()){
                $rslt =  $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
                return response()->json($rslt, 400);
            }
    
            DB::table('lahan_details')->where('id', $request->id)->delete();
            $rslt =  $this->ResultReturn(200, 'success', 'success');
            return response()->json($rslt, 200);
        }catch (\Exception $ex){
            return response()->json($ex);
        }
    }

    /**
     * @SWG\Post(
     *   path="/api/UpdateDetailLahanPohon",
	 *   tags={"Lahan"},
     *   security={
	 *     {"apiAuth": {}},
	 *   },
     *   summary="UpdateDetailLahanPohon",
     *   operationId="UpdateDetailLahanPohon",
     *   @SWG\Response(response=200, description="successful operation"),
     *   @SWG\Response(response=401, description="Unauthenticated"),
     *   @SWG\Response(response=404, description="Not Found"),
     *   @SWG\Response(response=500, description="internal server error"),
	 *		@SWG\Parameter(
     *          name="Parameters",
     *          in="body",
	 *			description="UpdateDetailLahanPohon",
     *          required=true, 
     *          type="string",
	 *   		@SWG\Schema(
     *              @SWG\Property(property="user_id", type="string", example="U0001"),
     *              @SWG\Property(property="lahan_no", type="string", example="L00000001"),
     *              @SWG\Property(property="tree_list", type="string", example="T0001"),
     *              @SWG\Property(property="detail_year", type="string", example="2021-04-20"),
     *          ),
     *      )
     * )
     *
     */
    public function UpdateDetailLahanPohon(Request $request){
        $validator = Validator::make($request->all(), [
            'lahan_no' => 'required',
            'tree_list' => 'required', 
            'detail_year' => 'required',
            'user_id' => 'required',
        ]);

        if($validator->fails()){
            $rslt =  $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
            return response()->json($rslt, 400);
        }

        $pohon_mpts = 0;
        $pohon_non_mpts = 0;
        $pohon_bawah = 0;
        $luas_area_tanam = 0;

        $listTree = $request->tree_list;

        foreach($listTree as $val){
            if($val['tree_category'] == "Pohon_Buah" || $val['tree_category'] == "MPTS"){
                $pohon_mpts = $pohon_mpts + $val['amount'];
            }else if($val['tree_category'] == "Tanaman_Bawah_Empon" || $val['tree_category'] == "CROPS"){
                $pohon_bawah = $pohon_bawah + $val['amount'];
            }else{
                // $tree = TreeLocation::where('tree_code', $val['tree_code'])->first();
                // if($tree->category == "KAYU"){
                    $pohon_non_mpts = $pohon_non_mpts + $val['amount'];   
                // }else if($tree->category == "MPTS"){
                //     $pohon_mpts = $pohon_mpts + $val['amount'];
                // }else{
                // $pohon_bawah = $pohon_bawah + $val['amount'];
                // }
            }
        }

        // $luas_area_tanam = ($pohon_mpts + $pohon_non_mpts) * 4;
        $tahun = Str::substr($request->detail_year,0,4);

        $getLahan =  DB::table('lahans')
            ->where('lahan_no', '=', $request->lahan_no)
            ->first();
        $luas_area_tanam = $getLahan->planting_area;
        
        if($getLahan->land_area >= $luas_area_tanam){
            DB::table('lahan_details')->where('lahan_no',$request->lahan_no)->where('detail_year', 'LIKE', "{$tahun}%")->delete();

            $listTree = $request->tree_list;
            // var_dump($listTree);
            foreach($listTree as $val){

                // var_dump($val['tree_code']);
                LahanDetail::create([
                    'lahan_no' => $request->lahan_no,
                    'tree_code' => $val['tree_code'],
                    'amount' => $val['amount'],
                    'detail_year' => $request->detail_year,
                    'user_id' => $request->user_id,
    
                    'created_at'=>Carbon::now(),
                    'updated_at'=>Carbon::now()
                ]);
                
                // if($val['tree_category'] == "Pohon_Buah" || $val['tree_category'] == "MPTS"){
                //     $pohon_mpts = $pohon_mpts + $val['amount'];
                // }else{
                //     $pohon_non_mpts = $pohon_non_mpts + $val['amount'];
                // }
            }

            Lahan::where('lahan_no', '=', $request->lahan_no)
            ->update([
                'pohon_mpts' => $pohon_mpts,
                'pohon_kayu' => $pohon_non_mpts,
                'tanaman_bawah' => $pohon_bawah,
                // 'planting_area' => $luas_area_tanam,
                // 'user_id' => $request->user_id,

                'updated_at'=>Carbon::now()
            ]);

            $rslt =  $this->ResultReturn(200, 'success', 'success');
            return response()->json($rslt, 200);
        }else{
            $rslt =  $this->ResultReturn(400, 'Pohon terlalu banyak, luas area tidak mencukupi', 'Pohon terlalu banyak, luas area tidak mencukupi');
            return response()->json($rslt, 400);
        }
    }

    /**
     * @SWG\Post(
     *   path="/api/UpdateLahan",
	 *   tags={"Lahan"},
     *   security={
	 *     {"apiAuth": {}},
	 *   },
     *   summary="Update Lahan",
     *   operationId="UpdateLahan",
     *   @SWG\Response(response=200, description="successful operation"),
     *   @SWG\Response(response=401, description="Unauthenticated"),
     *   @SWG\Response(response=404, description="Not Found"),
     *   @SWG\Response(response=500, description="internal server error"),
	 *		@SWG\Parameter(
     *          name="Parameters",
     *          in="body",
	 *			description="Update Lahan",
     *          required=true, 
     *          type="string",
	 *   		@SWG\Schema(
     *              @SWG\Property(property="lahan_no", type="integer", example="L00000001"),
     *              @SWG\Property(property="document_no", type="string", example="0909090909"),
     *              @SWG\Property(property="type_sppt", type="integer", example=1),
     *              @SWG\Property(property="land_area", type="string", example="8200.00"),
     *              @SWG\Property(property="longitude", type="date", example="110.3300613"),
     *              @SWG\Property(property="latitude", type="string", example="-7.580778"),
     *              @SWG\Property(property="coordinate", type="string", example="S734.847E11019.935"),
     *              @SWG\Property(property="village", type="string", example="33.05.10.18"),
     *              @SWG\Property(property="mu_no", type="string", example="025"),
     *              @SWG\Property(property="target_area", type="string", example="025001"),
     *              @SWG\Property(property="farmer_no", type="string", example="F00000001"),
     *               @SWG\Property(property="farmer_temp", type="string", example="Nullable"),
     *              @SWG\Property(property="fertilizer", type="string", example="Nullable"),   
     *              @SWG\Property(property="pesticide", type="string", example="Nullable"),
     *              @SWG\Property(property="sppt", type="string", example="Nullable"),
     *              @SWG\Property(property="description", type="string", example="Nullable"),
     *              @SWG\Property(property="photo1", type="string", example="Nullable"),
     *              @SWG\Property(property="photo2", type="string", example="Nullable"),
     *              @SWG\Property(property="photo3", type="string", example="Nullable"),
     *              @SWG\Property(property="photo4", type="string", example="Nullable"),
     *              @SWG\Property(property="group_no", type="string", example="Nullable"),
     *              @SWG\Property(property="planting_area", type="string", example="Nullable"),
     *              @SWG\Property(property="polygon", type="string", example="Nullable"),
     *              @SWG\Property(property="elevation", type="string", example="Nullable"),
     *              @SWG\Property(property="soil_type", type="string", example="Nullable"),
     *              @SWG\Property(property="current_crops", type="string", example="Nullable"),
     *              @SWG\Property(property="tutupan_lahan", type="string", example="Nullable"),
     *              @SWG\Property(property="kelerengan_lahan", type="string", example="Nullable"),
     *              @SWG\Property(property="access_to_water_sources", type="string", example="Nullable"),
     *              @SWG\Property(property="access_to_lahan", type="string", example="Nullable"), 
     *              @SWG\Property(property="water_availability", type="string", example="Nullable"),
     *              @SWG\Property(property="lahan_type", type="string", example="Nullable"),
     *              @SWG\Property(property="potency", type="string", example="Nullable"),
     *              @SWG\Property(property="jarak_lahan", type="string", example="Nullable"),
     *              @SWG\Property(property="exposure", type="string", example="Nullable"),  
     *              @SWG\Property(property="opsi_pola_tanam", type="string", example="Nullable"), 
     *              @SWG\Property(property="pohon_kayu", type="string", example="Nullable"), 
     *              @SWG\Property(property="pohon_mpts", type="string", example="Nullable"), 
     *              @SWG\Property(property="active", type="int", example="1"),
     *              @SWG\Property(property="user_id", type="string", example="U0002")
     * 
     *          ),
     *      )
     * )
     *
     */
    public function UpdateLahan(Request $request){
        try{
            $validator = Validator::make($request->all(), [    
                'lahan_no' => 'required',            
                'document_no' => 'required|max:255',
                'type_sppt' => 'required|max:255',
                'land_area' => 'required|max:255',
                'longitude' => 'required|max:255',
                'latitude' => 'required|max:255',
                'village' => 'required|max:255',
                'target_area' => 'required|max:255',
                'mu_no' => 'required|max:255',
                'active' => 'required|max:1',
                'farmer_no' => 'required|max:11',
                'user_id' => 'required|max:11',
            ]);
            
            // create Lahan Log
            $logData = [
                'status' => 'Updated',
                'lahan_no' => $request->lahan_no,
                'updated_data' => $request->all()
            ];
            $this->createLogs($logData);

            if($validator->fails()){
                $rslt =  $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
                return response()->json($rslt, 400);
            }

            // $getLastIdLahan = Lahan::orderBy('lahan_no','desc')->first(); 
            // if($getLastIdLahan){
            //     $lahan_no = 'L'.str_pad(((int)substr($getLastIdLahan->lahan_no,-8) + 1), 8, '0', STR_PAD_LEFT);
            // }else{
            //     $lahan_no = 'L00000001';
            // }
            // if($request->type_sppt){}
            // else{

            // }

            $getDesa = Desa::select('kode_desa','name','kode_kecamatan')->where('kode_desa','=',$request->village)->first(); 
            $getKec = Kecamatan::select('kode_kecamatan','name','kabupaten_no')->where('kode_kecamatan','=',$getDesa->kode_kecamatan)->first(); 
            $getKab = Kabupaten::select('kabupaten_no','name','province_code')->where('kabupaten_no','=',$getKec->kabupaten_no)->first(); 
            $getProv = Province::select('province_code','name')->where('province_code','=',$getKab->province_code)->first();
            
            // $codeempintern = '';
            // $internal_code = '-';
            // if($request->type_sppt == 1){
            //     if($request->user_id){
            //         $getUser = User::select('employee_no','role','name')->where('employee_no','=',$request->user_id)->first(); 
            //         if($getUser->role == 'ff'){
            //             $getUserFF = DB::table('field_facilitators')->where('ff_no','=',$getUser->employee_no)->first();
            //             $codeempintern = $getUserFF->fc_no;
            //         }else{
            //             $codeempintern = $getUser->employee_no;
            //         }
            //     }
            //     $ss = substr($codeempintern,0,2);
            //     $tt = str_replace(".","",$getDesa->kode_desa);
            //     $getLastInternalCodeLahan = Lahan::orderBy('lahan_no','desc')->first(); 
            //     if($getLastInternalCodeLahan){
            //         $internal_code = $ss.$tt.str_pad(((int)substr($getLastInternalCodeLahan->internal_code,-4) + 1), 4, '0', STR_PAD_LEFT);
            //     }else{
            //         $internal_code = $ss.$tt.'00001';
            //     }
            // }

            $coordinate = $this->getCordinate($request->longitude, $request->latitude);

            $codeempintern = '';
            $internal_code = '-';
            if($request->type_sppt != 0){

                $tt = $getDesa->kode_desa;
                $year = Carbon::now()->format('Y');
                $mu = $request->mu_no;
                $str = $request->lahan_no;
                $barcodestring = substr($str,3, 13) ;

                $internal_code = $tt.$year.$mu.$barcodestring;

            }

            $fertilizer = $this->ReplaceNull($request->fertilizer, 'string');
            $pesticide = $this->ReplaceNull($request->pesticide, 'string');
            $sppt = $this->ReplaceNull($request->sppt, 'string');

            $description = $this->ReplaceNull($request->description, 'string');
            $photo1 = $this->ReplaceNull($request->photo1, 'string');
            $photo2 = $this->ReplaceNull($request->photo2, 'string');
            $photo3 = $this->ReplaceNull($request->photo3, 'string');
            $photo4 = $this->ReplaceNull($request->photo4, 'string');
            $group_no = $this->ReplaceNull($request->group_no, 'string');
            $planting_area = $this->ReplaceNull($request->planting_area, 'int');
            $polygon = $this->ReplaceNull($request->polygon, 'string');
            $elevation = $this->ReplaceNull($request->elevation, 'string');
            $soil_type = $this->ReplaceNull($request->soil_type, 'string');
            $soil_photo = $this->ReplaceNull($request->soil_photo, 'string');
            $current_crops = $this->ReplaceNull($request->current_crops, 'string');
            $tutupan_lahan = $this->ReplaceNull($request->tutupan_lahan, 'string');
            $kelerengan_lahan = $this->ReplaceNull($request->kelerengan_lahan, 'string');
            $access_to_water_sources = $this->ReplaceNull($request->access_to_water_sources, 'string');
            $access_to_lahan = $this->ReplaceNull($request->access_to_lahan, 'string');
            $water_availability = $this->ReplaceNull($request->water_availability, 'string');
            $lahan_type = $this->ReplaceNull($request->lahan_type, 'string');
            $potency = $this->ReplaceNull($request->potency, 'string');
            $jarak_lahan = $this->ReplaceNull($request->jarak_lahan, 'string');
            $exposure = $this->ReplaceNull($request->exposure, 'string');
            $project = $this->ReplaceNull($request->project_no, 'string');
            $polygon_from_ff = $this->ReplaceNull($request->polygon_from_ff, 'string');
            $l = Lahan::where('lahan_no', '=', $request->lahan_no)->first();
            $luas = $l->gis_polygon_area > 0 ? $l->land_area : $request->land_area;
            $tanam = $l->gis_planting_area > 0 ? $l->planting_area : $request->planting_area;
            $gis = $l->gis_polygon_area > 0 ? $l->updated_gis : "belum";
            
            $getStatusData = Lahan::where(['lahan_no' => $request->lahan_no])->first();
            $getPivot = MainPivot::where('type','farmer_lahan')->where('key2',$request->lahan_no)->first();
            if($getStatusData->approve == 1 && $getPivot->program_year == $request->year){
                $rslt =  $this->ResultReturn(400, 'Tidak Dapat Melakukan Update, Data Sudah di Approve!, Silahkan Hubungi FC!', 'Error');
                return response()->json($rslt, 400);
            }else {
                $getLahanDatas = $this->DynamicDetail([
                    'sourceColumn' => 'lahan_no',
                    'id_type' => 'string',
                    'detail_id' => $request->lahan_no,
                    'tableName' => 'lahans',
                    'tableAlias' => 'A',
                    'field' => ['*'],
                    'relation' => [],
                    'req' => $request
                ]);
                $getLahanDatas_result = DB::select($getLahanDatas);
                $y = explode(",",$request->year);
                $tahun = count($y) > 1 ? $y[count($y)-2] : $request->year;
                        
                if($getLahanDatas_result[0]->approve == 1){
                    $createDatas = [ 
                        "1" => ['table_header' => 'lahan_no',                   'table_new_data' => $getLahanDatas_result[0]->lahan_no,                             'type' => 'string'],
                        "2" => ['table_header' => 'program_year',               'table_new_data' => $tahun,                                                         'type' => 'string'],
                        "3" => ['table_header' => 'document_no',                'table_new_data' => $getLahanDatas_result[0]->document_no,                          'type' => 'string'],
                        "4" => ['table_header' => 'internal_code',              'table_new_data' => $getLahanDatas_result[0]->internal_code,                          'type' => 'string'],
                        "5" => ['table_header' => 'land_area',                  'table_new_data' => $getLahanDatas_result[0]->land_area,                            'type' => 'string'],
                        "6" => ['table_header' => 'planting_area',              'table_new_data' => $getLahanDatas_result[0]->planting_area,                        'type' => 'string'],
                        "7" => ['table_header' => 'longitude',                  'table_new_data' => $getLahanDatas_result[0]->longitude,                        'type' => 'string'],
                        
                        "8" => ['table_header' => 'latitude',                           'table_new_data' => $getLahanDatas_result[0]->latitude,                                   'type' => 'string'],
                        "9" => ['table_header' => 'coordinate',                         'table_new_data' => $getLahanDatas_result[0]->coordinate,                             'type' => 'string'],
                        "10" => ['table_header' => 'polygon',                            'table_new_data' => $getLahanDatas_result[0]->polygon,                         'type' => 'string'],
                        "11" => ['table_header' => 'nearby_village',                     'table_new_data' => $getLahanDatas_result[0]->nearby_village,                          'type' => 'string'],
                        "12" => ['table_header' => 'nearby_village_distance',            'table_new_data' => $getLahanDatas_result[0]->nearby_village_distance,                          'type' => 'string'],
                        "13" => ['table_header' => 'village',                            'table_new_data' => $getLahanDatas_result[0]->village,                            'type' => 'string'],
                        "14" => ['table_header' => 'kecamatan',                          'table_new_data' => $getLahanDatas_result[0]->kecamatan,                        'type' => 'string'],
                        "15" => ['table_header' => 'city',                               'table_new_data' => $getLahanDatas_result[0]->city,                        'type' => 'string'],
                        
                        "16" => ['table_header' => 'province',                           'table_new_data' => $getLahanDatas_result[0]->province,                                   'type' => 'string'],
                        "17" => ['table_header' => 'description',                        'table_new_data' => $getLahanDatas_result[0]->description,                             'type' => 'string'],
                        "18" => ['table_header' => 'elevation',                          'table_new_data' => $getLahanDatas_result[0]->elevation,                         'type' => 'string'],
                        "19" => ['table_header' => 'soil_type',                          'table_new_data' => $getLahanDatas_result[0]->soil_type,                          'type' => 'string'],
                        "20" => ['table_header' => 'soil_photo',                         'table_new_data' => $getLahanDatas_result[0]->soil_photo,                          'type' => 'string'],
                        "21" => ['table_header' => 'current_crops',                      'table_new_data' => $getLahanDatas_result[0]->current_crops,                            'type' => 'string'],
                        "22" => ['table_header' => 'active',                             'table_new_data' => $getLahanDatas_result[0]->active,                        'type' => 'string'],
                        "23" => ['table_header' => 'farmer_no',                          'table_new_data' => $getLahanDatas_result[0]->farmer_no,                        'type' => 'string'],
                        
                        "24" => ['table_header' => 'farmer_temp',                        'table_new_data' => $getLahanDatas_result[0]->farmer_temp,                                   'type' => 'string'],
                        "25" => ['table_header' => 'mu_no',                              'table_new_data' => $getLahanDatas_result[0]->mu_no,                             'type' => 'string'],
                        "26" => ['table_header' => 'target_area',                        'table_new_data' => $getLahanDatas_result[0]->target_area,                         'type' => 'string'],
                        "27" => ['table_header' => 'user_id',                            'table_new_data' => $getLahanDatas_result[0]->user_id,                          'type' => 'string'],
                        "28" => ['table_header' => 'created_time',                       'table_new_data' => $getLahanDatas_result[0]->created_time,                          'type' => 'string'],
                        "29" => ['table_header' => 'created_at',                         'table_new_data' => $getLahanDatas_result[0]->created_at,                            'type' => 'string'],
                        "30" => ['table_header' => 'updated_at',                         'table_new_data' => $getLahanDatas_result[0]->updated_at,                        'type' => 'string'],
                        "31" => ['table_header' => 'sppt',                               'table_new_data' => $getLahanDatas_result[0]->sppt,                        'type' => 'string'],
                        
                        "32" => ['table_header' => 'tutupan_lahan',                              'table_new_data' => $getLahanDatas_result[0]->tutupan_lahan,                                   'type' => 'string'],
                        "33" => ['table_header' => 'tutupan_pohon_percentage',                   'table_new_data' => $getLahanDatas_result[0]->tutupan_pohon_percentage,                             'type' => 'string'],
                        "34" => ['table_header' => 'tutupan_pohon_photo',                        'table_new_data' => $getLahanDatas_result[0]->tutupan_pohon_photo,                         'type' => 'string'],
                        "35" => ['table_header' => 'tutupan_tanaman_bawah_percentage',           'table_new_data' => $getLahanDatas_result[0]->tutupan_tanaman_bawah_percentage,                          'type' => 'string'],
                        "36" => ['table_header' => 'tutupan_tanaman_bawah_photo',                'table_new_data' => $getLahanDatas_result[0]->tutupan_tanaman_bawah_photo,                          'type' => 'string'],
                        "37" => ['table_header' => 'tutupan_lain_bangunan_percentage',           'table_new_data' => $getLahanDatas_result[0]->tutupan_lain_bangunan_percentage,                            'type' => 'string'],
                        "38" => ['table_header' => 'tutupan_lain_bangunan_photo',                'table_new_data' => $getLahanDatas_result[0]->tutupan_lain_bangunan_photo,                        'type' => 'string'],
                        "39" => ['table_header' => 'photo1',                                     'table_new_data' => $getLahanDatas_result[0]->photo1,                        'type' => 'string'],
                        
                        "40" => ['table_header' => 'photo2',                                     'table_new_data' => $getLahanDatas_result[0]->photo2,                                   'type' => 'string'],
                        "41" => ['table_header' => 'photo3',                                     'table_new_data' => $getLahanDatas_result[0]->photo3,                             'type' => 'string'],
                        "42" => ['table_header' => 'photo4',                                     'table_new_data' => $getLahanDatas_result[0]->photo4,                         'type' => 'string'],
                        "43" => ['table_header' => 'group_no',                                   'table_new_data' => $getLahanDatas_result[0]->group_no,                          'type' => 'string'],
                        "44" => ['table_header' => 'kelerengan_lahan',                           'table_new_data' => $getLahanDatas_result[0]->kelerengan_lahan,                          'type' => 'string'],
                        "45" => ['table_header' => 'fertilizer',                                 'table_new_data' => $getLahanDatas_result[0]->fertilizer,                            'type' => 'string'],
                        "46" => ['table_header' => 'pesticide',                                  'table_new_data' => $getLahanDatas_result[0]->pesticide,                        'type' => 'string'],
                        "47" => ['table_header' => 'access_to_water_sources',                    'table_new_data' => $getLahanDatas_result[0]->access_to_water_sources,                        'type' => 'string'],
                        
                        "48" => ['table_header' => 'water_availability',                         'table_new_data' => $getLahanDatas_result[0]->water_availability,                                   'type' => 'string'],
                        "49" => ['table_header' => 'water_availability_level',                   'table_new_data' => $getLahanDatas_result[0]->water_availability_level,                             'type' => 'string'],
                        "50" => ['table_header' => 'access_to_lahan',                            'table_new_data' => $getLahanDatas_result[0]->access_to_lahan,                         'type' => 'string'],
                        "51" => ['table_header' => 'potency',                                    'table_new_data' => $getLahanDatas_result[0]->potency,                          'type' => 'string'],
                        "52" => ['table_header' => 'barcode',                                    'table_new_data' => $getLahanDatas_result[0]->barcode,                          'type' => 'string'],
                        "53" => ['table_header' => 'lahan_type',                                 'table_new_data' => $getLahanDatas_result[0]->lahan_type,                            'type' => 'string'],
                        "54" => ['table_header' => 'jarak_lahan',                                'table_new_data' => $getLahanDatas_result[0]->jarak_lahan,                        'type' => 'string'],
                        "56" => ['table_header' => 'exposure',                                   'table_new_data' => $getLahanDatas_result[0]->exposure,                        'type' => 'string'],
                        
                        "57" => ['table_header' => 'opsi_pola_tanam',                        'table_new_data' => $getLahanDatas_result[0]->opsi_pola_tanam,                                   'type' => 'string'],
                        "58" => ['table_header' => 'pohon_kayu',                             'table_new_data' => $getLahanDatas_result[0]->pohon_kayu,                             'type' => 'string'],
                        "59" => ['table_header' => 'pohon_mpts',                             'table_new_data' => $getLahanDatas_result[0]->pohon_mpts,                         'type' => 'string'],
                        "60" => ['table_header' => 'tanaman_bawah',                          'table_new_data' => $getLahanDatas_result[0]->tanaman_bawah,                          'type' => 'string'],
                        "61" => ['table_header' => 'type_sppt',                              'table_new_data' => $getLahanDatas_result[0]->type_sppt,                          'type' => 'string'],
                        "62" => ['table_header' => 'is_dell',                                'table_new_data' => $getLahanDatas_result[0]->is_dell,                            'type' => 'string'],
                        "63" => ['table_header' => 'complete_data',                          'table_new_data' => $getLahanDatas_result[0]->complete_data,                        'type' => 'string'],
                        "64" => ['table_header' => 'fc_complete_data',                       'table_new_data' => $getLahanDatas_result[0]->fc_complete_data,                        'type' => 'string'],
                        
                        "65" => ['table_header' => 'fc_complete_data_at',                    'table_new_data' => $getLahanDatas_result[0]->fc_complete_data_at,                                   'type' => 'string'],
                        "66" => ['table_header' => 'fc_complete_data_by',                    'table_new_data' => $getLahanDatas_result[0]->fc_complete_data_by,                             'type' => 'string'],
                        "67" => ['table_header' => 'approve',                                'table_new_data' => $getLahanDatas_result[0]->approve,                         'type' => 'string'],
                        "68" => ['table_header' => 'approved_by',                            'table_new_data' => $getLahanDatas_result[0]->approved_by,                          'type' => 'string'],
                        "69" => ['table_header' => 'approved_at',                            'table_new_data' => $getLahanDatas_result[0]->approved_at,                          'type' => 'string'],
                        "70" => ['table_header' => 'eligible_status',                        'table_new_data' => $getLahanDatas_result[0]->eligible_status,                            'type' => 'string'],
                        "71" => ['table_header' => 'update_eligible_at',                     'table_new_data' => $getLahanDatas_result[0]->update_eligible_at,                        'type' => 'string'],
                        "72" => ['table_header' => 'update_eligible_by',                     'table_new_data' => $getLahanDatas_result[0]->update_eligible_by,                        'type' => 'string'],
                        
                        "73" => ['table_header' => 'force_majeure_description',              'table_new_data' => $getLahanDatas_result[0]->force_majeure_description,                                   'type' => 'string'],
                        "74" => ['table_header' => 'floods',                                 'table_new_data' => $getLahanDatas_result[0]->floods,                             'type' => 'string'],
                        "75" => ['table_header' => 'wildfire',                               'table_new_data' => $getLahanDatas_result[0]->wildfire,                         'type' => 'string'],
                        "76" => ['table_header' => 'landslide',                              'table_new_data' => $getLahanDatas_result[0]->landslide,                          'type' => 'string'],
                        "77" => ['table_header' => 'drought',                                'table_new_data' => $getLahanDatas_result[0]->drought,                          'type' => 'string'],
                        "78" => ['table_header' => 'animal_protected_habitat',               'table_new_data' => $getLahanDatas_result[0]->animal_protected_habitat,                            'type' => 'string'],
                        "79" => ['table_header' => 'animal_protected_habitat_distance',      'table_new_data' => $getLahanDatas_result[0]->animal_protected_habitat_distance,                        'type' => 'string'],
                        "80" => ['table_header' => 'latest_condition',                       'table_new_data' => $getLahanDatas_result[0]->latest_condition,                        'type' => 'string'],
                        
                        "81" => ['table_header' => 'polygon_from_ff',                        'table_new_data' => $getLahanDatas_result[0]->polygon_from_ff,                                   'type' => 'string'],
                        "82" => ['table_header' => 'polygon_from_gis',                       'table_new_data' => $getLahanDatas_result[0]->polygon_from_gis,                             'type' => 'string'],
                        "83" => ['table_header' => 'gis_polygon_area',                       'table_new_data' => $getLahanDatas_result[0]->gis_polygon_area,                         'type' => 'string'],
                        "84" => ['table_header' => 'updated_gis',                            'table_new_data' => $getLahanDatas_result[0]->updated_gis,                          'type' => 'string'],
                        "85" => ['table_header' => 'gis_updated_at',                         'table_new_data' => $getLahanDatas_result[0]->gis_updated_at,                          'type' => 'string'],
                        "86" => ['table_header' => 'gis_officer',                            'table_new_data' => $getLahanDatas_result[0]->gis_officer,                            'type' => 'string'],
                        "87" => ['table_header' => 'gps_accuration',                         'table_new_data' => $getLahanDatas_result[0]->gps_accuration,                        'type' => 'string'],
                        "88" => ['table_header' => 'status',                                 'table_new_data' => $getLahanDatas_result[0]->status,                        'type' => 'string'],
                        
                        "89" => ['table_header' => 'status_perubahan_tutupan',               'table_new_data' => $getLahanDatas_result[0]->status_perubahan_tutupan,                                   'type' => 'string'],
                        "90" => ['table_header' => 'plant_status',                           'table_new_data' => $getLahanDatas_result[0]->plant_status,                             'type' => 'string'],
                        "91" => ['table_header' => 'seed_is_modified',                       'table_new_data' => $getLahanDatas_result[0]->seed_is_modified,                         'type' => 'string'],
                        "92" => ['table_header' => 'seed_verify_status',                     'table_new_data' => $getLahanDatas_result[0]->seed_verify_status,                          'type' => 'string'],
                        "93" => ['table_header' => 'is_assigned_by',                         'table_new_data' => $request->user_id,                          'type' => 'string'],
                        "94" => ['table_header' => 'gis_planting_area',                      'table_new_data' => $getLahanDatas_result[0]->gis_planting_area,                         'type' => 'string'],
                        ];
                        $datas =  $this->dynamicCreate([
                                    'tableName' => 'log_lahans',
                                    'inputData' => $createDatas,
                                ]);
                        $result = DB::insert($datas);
                    } 
                $unique = Lahan::where('lahan_no',$request->lahan_no)->where('farmer_no','!=',$request->farmer_no)->first();
                if(is_null($unique)) {
                    Lahan::where('lahan_no', '=', $request->lahan_no)
                    ->update([
                        'document_no' => $request->document_no,
                        'internal_code' => $internal_code,
                        'land_area' => $luas,
                        'longitude' => $request->longitude,
                        'latitude' => $request->latitude,
                        'coordinate' => $coordinate,
                        'village' => $request->village,
                        'kecamatan' => $getKec->kode_kecamatan,
                        'city' => $getKab->kabupaten_no,
                        'province' => $getProv->province_code,
                        'mu_no' => $request->mu_no,
                        'target_area' => $request->target_area,
                        'active' => $request->active,
                        'farmer_no' => $request->farmer_no,
                        'farmer_temp' => $this->ReplaceNull($request->farmer_temp, 'string'),
                        'user_id' => $request->user_id,
        
                        'fertilizer' => $fertilizer,
                        'pesticide' => $pesticide,
                        'sppt' => $sppt,
        
                        'updated_at'=>Carbon::now(),
        
                        'access_to_water_sources' => $access_to_water_sources,
                        'access_to_lahan' => $access_to_lahan,
                        'jarak_lahan' => $jarak_lahan,
                        'water_availability' => $water_availability,
        
                        'planting_area' => $tanam,
                        'polygon' => $polygon,
                        'description' => $description,
                        'exposure' => $exposure,
                        'elevation' => $elevation,
                        'soil_type' => $soil_type,
                        'soil_photo' => $soil_photo,
                        'lahan_type' => $lahan_type,
                        'potency' => $potency,
                        'current_crops' => $current_crops,
                        'tutupan_lahan' => $tutupan_lahan,
                        'group_no' => $group_no,
                        'kelerengan_lahan' => $kelerengan_lahan,
        
                        'photo1' => $photo1,
                        'photo2' => $photo2,
                        'photo3' => $photo3,
                        'photo4' => $photo4,
        
                        'opsi_pola_tanam' => $this->ReplaceNull($request->opsi_pola_tanam, 'string'),
                        'pohon_kayu' => $this->ReplaceNull($request->pohon_kayu, 'int'),
                        'pohon_mpts' => $this->ReplaceNull($request->pohon_mpts, 'int'),
                        'type_sppt' => $this->ReplaceNull($request->type_sppt, 'int'),
                        
                        //NEW
                            
                        'nearby_village' => $this->ReplaceNull($request->nearby_village, 'int'), //boolean 0/1
                        'nearby_village_distance' => $this->ReplaceNull($request->nearby_village_distance, 'int'), //in kilometers
                        'tutupan_pohon_percentage' => $this->ReplaceNull($request->tutupan_pohon_percentage, 'int'), //Integer 1-100
                        'tutupan_pohon_photo' => $this->ReplaceNull($request->tutupan_pohon_photo, 'string'), //Varchar: file path
                        'tutupan_tanaman_bawah_percentage' => $this->ReplaceNull($request->tutupan_tanaman_bawah_percentage, 'int'), //Integer 1-100
                        'tutupan_tanaman_bawah_photo' => $this->ReplaceNull($request->tutupan_tanaman_bawah_photo, 'string'), //Varchar: file path
                        'tutupan_lain_bangunan_percentage' => $this->ReplaceNull($request->tutupan_lain_bangunan_percentage, 'int'), //Integer 1-100
                        'tutupan_lain_bangunan_photo' => $this->ReplaceNull($request->tutupan_lain_bangunan_photo, 'string'), //Varchar: file path
                        'floods' => $this->ReplaceNull($request->floods, 'int'), //boolean 0/1
                        'wildfire' => $this->ReplaceNull($request->wildfire, 'int'), //boolean 0/1
                        'landslide' => $this->ReplaceNull($request->landslide, 'int'), //boolean 0/1
                        'drought' => $this->ReplaceNull($request->drought, 'int'), //boolean 0/1
                        'animal_protected_habitat' => $this->ReplaceNull($request->animal_protected_habitat, 'string'),//boolean 0/1
                        'animal_protected_habitat_distance' => $this->ReplaceNull($request->animal_protected_habitat_distance, 'string'),
                        'polygon_from_ff' => $this->ReplaceNull($request->polygon_from_ff, 'string'), //Varchar: file path
                        'water_availability_level' => $this->ReplaceNull($request->water_availability_level, 'int'), //boolean 0/1/2
                        'gps_accuration' => $this->ReplaceNull($request->gps_accuration, 'int'),
                        'updated_gis' => $gis,
                        'approve' => 0,
                        'is_dell' => 0
                    ]);
                    //Create Detail Log Start
                    //log
                    // $getLahanDatas = $this->DynamicDetail([
                    //     'sourceColumn' => 'lahan_no',
                    //     'id_type' => 'string',
                    //     'detail_id' => $request->lahan_no,
                    //     'tableName' => 'lahan_details',
                    //     'tableAlias' => 'A',
                    //     'field' => ['*'],
                    //     'relation' => [],
                    //     'req' => $request
                    // ]);
                    // $getLahanDatas_result = DB::select($getLahanDatas);
                    // if(count($getLahanDatas_result)> 0){
                    //     foreach($getLahanDatas_result as $detail){
                    //         $createLogDetailDatas = [
                    //             "1" => ['table_header' => 'lahan_no',                   'table_new_data' => $detail->lahan_no,                             'type' => 'string'],
                    //             "2" => ['table_header' => 'tree_code',               'table_new_data' => $detail->tree_code,                         'type' => 'string'],
                    //             "3" => ['table_header' => 'amount',                'table_new_data' => $detail->amount,                          'type' => 'string'],
                    //             "4" => ['table_header' => 'detail_year',              'table_new_data' => $detail->detail_year,                          'type' => 'string'],
                    //             "5" => ['table_header' => 'user_id',                  'table_new_data' => $detail->user_id,                            'type' => 'string'],
                    //             "4" => ['table_header' => 'created_at',              'table_new_data' => $detail->created_at,                          'type' => 'string'],
                    //             "5" => ['table_header' => 'updated_at',                  'table_new_data' => $detail->updated_at,                            'type' => 'string'],
                    //         ];
                    //         $createLogDetailDatas_query = $this->dynamicCreate([
                    //                 'tableName' => 'log_lahan_details',
                    //                 'inputData' => $createLogDetailDatas,
                    //             ]);
                    //         $createLogDetailDatas_result = DB::insert($createLogDetailDatas_query);
                    //     }
                    // }
                    // //main
                    // $updateDetailLahans = [ 
                    //     "0" => ['table_header' => 'amount',                     'table_new_data' => '0',                'type' => 'string'],
                    //     "1" => ['table_header' => 'detail_year',                'table_new_data' => date("Y-m-d"),      'type' => 'string'],
                    // ];
                            
                    //     $DetailDatasLahan =  $this->dynamicUpdate([
                    //         'current_id' => $request->lahan_no,
                    //         'tableName' => "lahan_details",
                    //         'inputData' => $updateDetailLahans,
                    //         'other_id_index' => 'lahan_no',
                    //         'id_data_type' => 'string'
                    //     ]);
                    // $DetailLahanDatas_res = DB::update($DetailDatasLahan);
                    //Create Detail Log End
                    
                    
                    if($request->project_no != "-"){
                        $pivot = LahanProject::where([
                                    'lahan_no' => $request->lahan_no,
                                    'project_no' => $request->project_no
                                ])->first();
                
                        if(is_null($pivot)) {
                            $pivot = new LahanProject([
                                'lahan_no' => $request->lahan_no,
                                'project_no' => $request->project_no,
                                'program_year' => substr($request->year,-4),
                                'created_at'=>Carbon::now(),
                                'updated_at'=>Carbon::now()
                            ]);
                            $pivot->save();
                        } else {
                            $pivot->program_year = $request->year;
                            $pivot->update();
                        }
                        // LahanProject::where('lahan_no',$request->lahan_no)->delete();
                        // LahanProject::create([
                        //         'lahan_no' => $request->lahan_no,
                        //         'project_no' => $request->project_no,
                        //         'program_year' => $request->year,
                        //         'created_at'=>Carbon::now(),
                        //         'updated_at'=>Carbon::now()
                        //     ]);
                    }
                    if($request->list_ff_device != "-"){
                        LahanFFDevice::where('lahan_no',$request->lahan_no)->delete();
                        foreach($request->list_ff_device as $device){
                            LahanFFDevice::create([
                                'lahan_no' => $request->lahan_no,
                                'phone_brand' => $device['phone_brand'],
                                'type_model' => $device['type_model'],
                                'android_version' => $device['android_version'],
                                'ram_total' => $device['ram_total'],
                                'free_ram_spaces' => $device['free_ram_spaces'],
                                'internal_memory' => $device['internal_memory'],
                                'camera_resolution' => $device['camera_resolution'],
                                'censors' => $device['censors'],
                                'created_at' => Carbon::now(),
                                'updated_at' => Carbon::now(),
                                'is_del' => 0
                                ]);
                        }
                    }
        
                    if($request->list_polygons != "-"){
                        LahanPolygon::where('lahan_no',$request->lahan_no)->delete();
                        foreach($request->list_polygons as $polygon){
                            LahanPolygon::create([
                                'lahan_no' => $request->lahan_no,
                                'latitude' => $polygon['latitude'],
                                'longitude' => $polygon['longitude'],
                                'order' => $polygon['sort'],
                                'created_at'=>Carbon::now(),
                                'updated_at'=>Carbon::now()
                            ]);
                        }
                    }
                    
                    // if(isset($request->project_no)){
                    //     LahanProject::where('lahan_no',$request->lahan_no)->delete();
                    //     LahanProject::create([
                    //             'lahan_no' => $request->lahan_no,
                    //             'project_no' => $request->project_no,
                    //             'program_year' => substr($request->year,-4),
                    //             'created_at'=>Carbon::now(),
                    //             'updated_at'=>Carbon::now()
                    //         ]);
                    // }
                    // if(isset($request->list_polygon)){
                    //     LahanPolygon::where('lahan_no',$request->lahan_no)->delete();
                    //     $order = 1;
                    //     foreach($request->list_polygon as $polygon){
                    //          LahanPolygon::create([
                    //             'lahan_no' => $request->lahan_no,
                    //             'latitude' => $polygon['latitude'],
                    //             'longitude' => $polygon['longitude'],
                    //             'order' => $polygon['order'],
                    //             'created_at'=>Carbon::now(),
                    //             'updated_at'=>Carbon::now()
                    //         ]);
                    //     }
                    //     DB::commit();
                    // }
                    // var_dump('-');
                    // $getUserIdLahan = Lahan::where('id','=',$request->id)->first();
                    // if($request->user_id == $getUserIdLahan->user_id ){}
                    if($project != "-" && $fertilizer != "-" && $pesticide != "-" && $description != "-" &&  $access_to_water_sources != "-" && $access_to_lahan != "-" && $jarak_lahan != "-"  && $water_availability != "-")
                    {
                        Lahan::where('lahan_no', '=', $request->lahan_no)
                        ->update
                        (['complete_data' => 1]);
                    }
                    
                    if ($request->year != null) {
                        MainPivot::where('type','farmer_lahan')->where('key2',$request->lahan_no)->update(
                            [
                                'key1' => $request->farmer_no,
                                'program_year' => $request->year ?? ""
                            ]);
                            
                        $tutup = LahanTutupan::where([
                            'lahan_no' => $request->lahan_no,
                            'program_year' => substr($request->year,-4)
                        ])->first();
        
                        if(is_null($tutup)) {
                            $tutup = new LahanTutupan([
                                'lahan_no' => $request->lahan_no,
                                'program_year' => substr($request->year,-4),
                                'land_area' => $request->land_area,
                                'planting_area' => $request->planting_area,
                                'tutupan_lahan' => $request->tutupan_lahan,
                                'pattern' => $request->opsi_pola_tanam
                            ]);
                            $tutup->save();
                        } else {
                            $tutup->land_area = $request->land_area;
                            $tutup->planting_area = $request->planting_area;
                            $tutup->tutupan_lahan = $request->tutupan_lahan;
                            $tutup->pattern = $request->opsi_pola_tanam;
                            $tutup->update();
                        }
                    }
        
                    $rslt =  $this->ResultReturn(200, 'success', 'success');
                    return response()->json($rslt, 200);
                } else {
                    $rslt =  $this->ResultReturn(400, 'No Lahan Sudah Digunakan', 'Error');
                    return response()->json($rslt, 400);
                }
            }
        }catch (\Exception $ex){
            return response()->json($ex);
        }
    }
    
    /**
     * @SWG\Post(
     *   path="/api/UpdateLahanGIS",
	 *   tags={"Lahan"},
     *   security={
	 *     {"apiAuth": {}},
	 *   },
     *   summary="Update Lahan GIS",
     *   operationId="UpdateLahanGIS",
     *   @SWG\Response(response=200, description="successful operation"),
     *   @SWG\Response(response=401, description="Unauthenticated"),
     *   @SWG\Response(response=404, description="Not Found"),
     *   @SWG\Response(response=500, description="internal server error"),
	 *		@SWG\Parameter(
     *          name="Parameters",
     *          in="body",
	 *			description="Update Lahan GIS",
     *          required=true, 
     *          type="string",
	 *   		@SWG\Schema(
     *              @SWG\Property(property="lahan_no", type="integer", example="L00000001"),
     *              @SWG\Property(property="soil_type", type="string", example="Mandatory"),
     *              @SWG\Property(property="current_crops", type="string", example="Mandatory"),
     *              @SWG\Property(property="tutupan_lahan", type="string", example="Mandatory"),
     *              @SWG\Property(property="kelerengan_lahan", type="string", example="Mandatory"),     * 
     *              @SWG\Property(property="elevation", type="string", example="Mandatory"),
     *              @SWG\Property(property="potency", type="string", example="Mandatory"),
     *              @SWG\Property(property="exposure", type="string", example="Mandatory"),  
     * 
     *          ),
     *      )
     * )
     *
     */
    public function UpdateLahanGIS(Request $request){
        try{
            $validator = Validator::make($request->all(), [    
                'lahan_no' => 'required',           
                'longitude' => 'required',
                'latitude' => 'required',
                'soil_type' => 'required',
                'potency' => 'required',
                'kelerengan_lahan' => 'required',
                'village' => 'required',
                // 'exposure' => 'required',
                'elevation' => 'required',
                // 'current_crops' => 'required',
                'tutupan_lahan' => 'required',
            ]);

            if($validator->fails()){
                $rslt =  $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
                return response()->json($rslt, 400);
            }

            $coordinate = $this->getCordinate($request->longitude, $request->latitude);
            
            // create Lahan Log
            $logData = [
                'status' => 'Updated GIS',
                'lahan_no' => $request->lahan_no,
                'updated_data' => $request->all()
            ];
            $this->createLogs($logData);
            
            Lahan::where('lahan_no', '=', $request->lahan_no)
            ->update([
                'village' => $request->village,
                'longitude' => $request->longitude,
                'latitude' => $request->latitude,
                'coordinate' => $coordinate,

                // 'exposure' => $request->exposure,
                'elevation' => $request->elevation,
                'soil_type' => $request->soil_type,
                'soil_photo' => $request->soil_photo,
                'potency' => $request->potency,
                // 'current_crops' => $request->current_crops,
                'tutupan_lahan' => $request->tutupan_lahan,
                'kelerengan_lahan' => $request->kelerengan_lahan,
                'updated_gis' => 'sudah',

            ]);

            $rslt =  $this->ResultReturn(200, 'success', 'success');
            return response()->json($rslt, 200); 
        }catch (\Exception $ex){
            return response()->json($ex);
        }
    }

    /**
     * @SWG\Post(
     *   path="/api/SoftDeleteLahan",
	 *   tags={"Lahan"},
     *   security={
	 *     {"apiAuth": {}},
	 *   },
     *   summary="Soft Delete Lahan",
     *   operationId="SoftDeleteLahan",
     *   @SWG\Response(response=200, description="successful operation"),
     *   @SWG\Response(response=401, description="Unauthenticated"),
     *   @SWG\Response(response=404, description="Not Found"),
     *   @SWG\Response(response=500, description="internal server error"),
	 *		@SWG\Parameter(
     *          name="Parameters",
     *          in="body",
	 *			description="Soft Delete Lahan",
     *          required=true, 
     *          type="string",
	 *   		@SWG\Schema(
     *              @SWG\Property(property="id", type="string", example="2")
     *          ),
     *      )
     * )
     *
     */
    public function SoftDeleteLahan(Request $request){
        try{
            $validator = Validator::make($request->all(), [    
                'id' => 'required'
            ]);

            if($validator->fails()){
                $rslt =  $this->ResultReturn(400, $validator->errors()->first(), $validator->errors()->first());
                return response()->json($rslt, 400);
            }
            Lahan::where('id', '=', $request->id)
                    ->update
                    ([
                        'is_dell' => 1
                    ]);
                    
            // create Lahan Log
            $logData = [
                'status' => 'Soft Deleted',
                'lahan_no' => Lahan::where('id', '=', $request->id)->first()->lahan_no ?? '9999999999999999'
            ];
            $this->createLogs($logData);
            
            $rslt =  $this->ResultReturn(200, 'success', 'success');
            return response()->json($rslt, 200); 
        }catch (\Exception $ex){
            return response()->json($ex);
        }
    }
    
    // Create Logs for Lahan
    public function createLogs($logData) {
        // get lahan data
        $lahan = Lahan::where('lahan_no', $logData['lahan_no'])->first();
        // get Petani Data
        if (isset($lahan->farmer_no)) {
            $farmer = Farmer::where('farmer_no', $lahan->farmer_no)->first();
        }
        // get ff data
        if(isset($lahan->user_id)) {
            $ff = FieldFacilitator::where('ff_no', $lahan->user_id)->first();
        }
        // get fc data
        if (isset($ff->fc_no)) {
            $fc = Employee::where('nik', $ff->fc_no)->first();
        }
        // user auth data
        $user = Auth::user();
        
        // set message
        $message =  $logData['status'] . ' ' . 
                    ($lahan['lahan_no'] ?? '-') . 
                    '[petani = ' . 
                    ($farmer['farmer_no'] ?? '-') . '_' . ($farmer['name'] ?? '-') . '_' . ($farmer['nickname'] ?? '-') .
                    ', ff = ' . 
                    ($ff->ff_no ?? '-') . '_' . ($ff->name ?? '-') .
                    ', fc = ' . 
                    ($fc->name ?? '-') .
                    ']' . 
                    ($logData['status'] == 'Updated' || $logData['status'] == 'Updated GIS'  ? (', Updated data = [' . $this->getSpecificUpdatedLahanData($logData['updated_data']) . '] ') : ' ') .
                    'by ' .
                    ($user['email'] ?? '-');
                    
        $log = Log::channel('lahans');
        
        if ($logData['status'] == 'Updated' || $logData['status'] == 'Created') {
            $log->notice($message);
        } else if ($logData['status'] == 'Soft Deleted') {
            $log->warning($message);
        } else if ($logData['status'] == 'Deleted') {
            $log->alert($message);
        } else {
            $log->info($message);
        }
        
        
        
        return true;
    }
    
    // get specific Updated lahan data
    private function getSpecificUpdatedLahanData($data) {
        // get lahan data
        $lahan = Lahan::where('lahan_no', ($data['lahan_no'] ?? '999999999999999'))->first();
        if ($lahan) {
            // $listUpdatedData = []; 
            $listUpdatedData = array_map(function($value, $key) use ($lahan) {
                if (isset($value) && isset($lahan[$key])) {
                    if ($value != $lahan[$key]) {
                        return $key.'=('.$lahan[$key].' => ' .$value . ')';
                    }
                }
            }, array_values($data), array_keys($data));
            
            $listUpdatedData =  array_filter($listUpdatedData);
            return implode(',',$listUpdatedData);
            // return str_replace('&', ',', urldecode(http_build_query($listUpdatedData)));
        } else {
            return '-';
        }
    }
    
    public function UpdateProjectLahan(Request $request) {
        $validator = Validator::make($request->all(), [
            'lahan_no'=>'required',
        ]);

        if ($validator->fails()) {
            $messages = $validator->messages(); 
            
            return redirect()->back()->withInput()->withErrors($validator);
        }
        
        //$lahans = $request->lahan_no;

        foreach($request->get('lahan_no') as $lahanID => $row) {
            Lahan::where('id', $lahanID)->update([
                'project_no' => $row['project_no'],
                'project_name' => $row['project_name']
            ]);
        }
    
        return response()->json('suceess', 200);
    }
}
