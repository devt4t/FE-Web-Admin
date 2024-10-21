<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('Regist', 'UserController@Regist');
Route::post('Login', 'UserController@Login');
Route::post('LoginWeb', 'UserController@LoginWeb');
Route::post('ForgotPassword', 'UserController@ForgotPassword');

Route::get('GetFarmerAllTemp', 'Api\FarmerController@GetFarmerAllTempDelete');
Route::get('GetFarmerDetailTemp', 'Api\FarmerController@GetFarmerDetail');
Route::get('GetTotalTreesPlanted', 'Api\TreesPlantedController@index');
Route::get('GekoDashboardAllOutside', 'Api\DashboardController@all');

Route::get('GetApi', 'UserController@GetApi');

Route::get('GetDistributionReportFullOutside', 'Api\TemporaryController@GetDistributionReportOutside');
Route::get('GetDistributionReportUmumOutside', 'Api\TemporaryController@GetDistributionReportUmumOutside');
Route::get('GetMonitoringReportEnhanced', 'Api\TemporaryController@GetMonitoringReportEnhanced');
Route::get('GetDataMainLahan', 'Api\TemporaryController@GetDataMainLahan');
Route::get('GetDataLahanByDocumentSPPT', 'Api\TemporaryController@GetDataLahanByDocumentSPPT');

Route::get('Get3s4Nursery', 'Api\NurseryController@Get3s4Nursery');
Route::get('Get3s4NurseryAll', 'Api\NurseryController@Get3s4NurseryAll');
Route::get('getMu4Nursery', 'Api\NurseryController@getMu4Nursery');

Route::get('GetPHPInfo', 'Api\TemporaryController@GetPHPInfo');
Route::get('GetPHDetailNursery', 'Api\PlantingHoleController@GetPHDetailNursery');

Route::group(['middleware' => ['auth:api']], function () {
    Route::post('Logout', 'UserController@Logout');
    Route::post('EditProfile', 'UserController@EditProfile');
    Route::post('EditUser', 'UserController@EditUser');
    Route::post('DeleteUser', 'UserController@DeleteUser');
    Route::post('ResetPasswordUser', 'UserController@ResetPasswordUser');
    Route::get('GetUser', 'UserController@GetUser');
    
    Route::post('task', 'UserController@TaskCreate');
    Route::post('task-group', 'UserController@TaskGroupCreate');
    Route::get('task', 'UserController@TaskList');
    Route::get('task-group', 'UserController@TaskGroupList');
    Route::post('task/generate', 'UserController@TaskGenerate');
    Route::get('role-task/{role_id}', 'UserController@RoleTaskDetail');
    Route::get('roles', 'UserController@RoleList');
    Route::post('role-task/create', 'UserController@RoleTaskCreate');

    // Dashboard
    Route::get('Dashboard', 'Api\UtilitiesController@Dashboard');
    Route::get('GekoDashboardAll', 'Api\DashboardController@all');
    Route::get('GekoDashboardTotalDatas', 'Api\DashboardController@totalDatas');
    Route::get('GetDashboardMapData', 'Api\DashboardController@GetDashboardMapData');
    Route::get('Dashboard/DetailFieldFacilitator', 'Api\DashboardController@DetailFieldFacilitator');
    Route::get('Dashboard/DetailPetaniLahan', 'Api\DashboardController@DetailPetaniLahan');
    
    Route::get('GetProvinceAdmin', 'Api\UtilitiesController@GetProvinceAdmin');
    Route::get('GetKabupatenAdmin', 'Api\UtilitiesController@GetKabupatenAdmin');
    Route::get('GetKabupatenByProvince', 'Api\UtilitiesController@GetKabupatenByProvince');
    Route::get('GetKecamatanAdmin', 'Api\UtilitiesController@GetKecamatanAdmin');
    Route::get('GetDesaAdmin', 'Api\UtilitiesController@GetDesaAdmin');
    Route::get('GetDesaAdminDev', 'Api\UtilitiesController@GetDesaAdminDev');
    Route::get('GetManagementUnitAdmin', 'Api\UtilitiesController@GetManagementUnitAdmin');
    Route::get('GetTargetAreaAdmin', 'Api\UtilitiesController@GetTargetAreaAdmin');

    Route::get('GetProvince', 'Api\UtilitiesController@GetProvince');
    Route::get('GetKabupaten', 'Api\UtilitiesController@GetKabupaten');
    Route::get('GetKecamatan', 'Api\UtilitiesController@GetKecamatan');
    Route::get('GetDesa', 'Api\UtilitiesController@GetDesa');
    Route::get('GetDesaNew', 'Api\UtilitiesController@GetDesaNew');

    Route::post('AddProvince', 'Api\UtilitiesController@AddProvince');
    Route::post('AddKabupaten', 'Api\UtilitiesController@AddKabupaten');
    Route::post('AddKecamatan', 'Api\UtilitiesController@AddKecamatan');
    Route::post('AddDesa', 'Api\UtilitiesController@AddDesa');

    Route::post('UpdateProvince', 'Api\UtilitiesController@UpdateProvince');
    Route::post('UpdateKabupaten', 'Api\UtilitiesController@UpdateKabupaten');
    Route::post('UpdateKecamatan', 'Api\UtilitiesController@UpdateKecamatan');
    Route::post('UpdateDesa', 'Api\UtilitiesController@UpdateDesa');

    Route::post('DeleteProvince', 'Api\UtilitiesController@DeleteProvince');
    Route::post('DeleteKabupaten', 'Api\UtilitiesController@DeleteKabupaten');
    Route::post('DeleteKecamatan', 'Api\UtilitiesController@DeleteKecamatan');
    Route::post('DeleteDesa', 'Api\UtilitiesController@DeleteDesa');

    Route::get('GetManagementUnit', 'Api\UtilitiesController@GetManagementUnit');
    Route::get('GetTargetArea', 'Api\UtilitiesController@GetTargetArea');
    Route::post('AddManagementUnit', 'Api\UtilitiesController@AddManagementUnit');
    Route::post('AddTargetArea', 'Api\UtilitiesController@AddTargetArea');
    Route::post('UpdateManagementUnit', 'Api\UtilitiesController@UpdateManagementUnit');
    Route::post('UpdateTargetArea', 'Api\UtilitiesController@UpdateTargetArea');
    Route::post('DeleteManagementUnit', 'Api\UtilitiesController@DeleteManagementUnit');
    Route::post('DeleteTargetArea', 'Api\UtilitiesController@DeleteTargetArea');

    Route::get('GetVerification', 'Api\UtilitiesController@GetVerification');
    Route::post('AddVerification', 'Api\UtilitiesController@AddVerification');
    Route::post('UpdateVerification', 'Api\UtilitiesController@UpdateVerification');
    Route::post('DeleteVerification', 'Api\UtilitiesController@DeleteVerification');

    Route::get('GetPekerjaan', 'Api\UtilitiesController@GetPekerjaan');
    Route::get('GetSuku', 'Api\UtilitiesController@GetSuku');
    Route::post('AddPekerjaan', 'Api\UtilitiesController@AddPekerjaan');
    Route::post('AddSuku', 'Api\UtilitiesController@AddSuku');
    Route::post('UpdatePekerjaan', 'Api\UtilitiesController@UpdatePekerjaan');
    Route::post('UpdateSuku', 'Api\UtilitiesController@UpdateSuku');
    Route::post('DeletePekerjaan', 'Api\UtilitiesController@DeletePekerjaan');
    Route::post('DeleteSuku', 'Api\UtilitiesController@DeleteSuku');

    Route::get('GetAllMenuAccess', 'Api\UtilitiesController@GetAllMenuAccess');
    
    
    
    //SCOOPING VISIT
    Route::get('GetScoopingAll', 'Api\RraPraController@GetScoopingAll');
    Route::get('GetDetailScooping', 'Api\RraPraController@GetDetailScooping');
    Route::post('AddScooping', 'Api\RraPraController@AddScooping');
    Route::post('UpdateScooping', 'Api\RraPraController@UpdateScooping');
    Route::post('VerificationScooping', 'Api\RraPraController@VerificationScooping');
    Route::post('VerificationPMScooping', 'Api\RraPraController@VerificationPMScooping');
    Route::post('UnverificationScooping', 'Api\RraPraController@UnverificationScooping');
    Route::get('MailtoGis', 'Api\RraPraController@MailtoGis');
    Route::get('MailToSocialOfficer', 'Api\RraPraController@MailToSocialOfficer');
    Route::get('EmailtoGis', 'Api\RraPraController@EmailtoGis');
    
    //RRA-PRA
    Route::get('GetRraPraAll', 'Api\RraPraController@GetRraPraAll');
    Route::get('rra-pra', 'Api\RraPraController@GetNewRraPraAll');
    Route::get('GetDetailRraPra', 'Api\RraPraController@GetDetailRraPra');
    Route::post('AddRraPra', 'Api\RraPraController@AddRraPra');
    Route::post('UpdateRraPra', 'Api\RraPraController@UpdateRraPra');
    Route::post('VerificationRraPra', 'Api\RraPraController@VerificationRraPra');
    Route::post('VerificationRraPraDev', 'Api\RraPraController@VerificationRraPraDev');
    Route::post('VerificationPMRraPra', 'Api\RraPraController@VerificationPMRraPra');
    Route::post('UnverificationRraPra', 'Api\RraPraController@UnverificationRraPra');
    Route::get('ReportRra', 'Api\RraPraController@ReportRra');
    Route::get('ReportPra', 'Api\RraPraController@ReportPra');
    
    
    
    // REPORT SCOOPING VISIT-RRA-PRA
    Route::get('ReportScooping', 'Api\RraPraController@ReportScooping');
    Route::get('ReportRra', 'Api\RraPraController@ReportRra');
    // Route::get('ReportPra', 'Api\RraPraController@ReportPra');
    
    
    // Participan-Donors
    Route::get('GetDonorAllAdmin', 'Api\DonorController@GetDonorAllAdmin');
    Route::get('DetailDonor', 'Api\DonorController@DetailDonor');
    Route::post('AddNewDonor', 'Api\DonorController@AddNewDonor');
    Route::post('AddDonor', 'Api\DonorController@AddDonor');
    Route::post('UpdateDonor', 'Api\DonorController@UpdateDonor');
    Route::post('UpdateDonorNew', 'Api\DonorController@UpdateDonorNew');
    Route::post('DeleteDonor', 'Api\DonorController@DeleteDonor');
    Route::post('newDeleteDonor', 'Api\DonorController@newDeleteDonor');
    
    
    
    // Project
    Route::get('GetProjectAllAdmin', 'Api\ProjectController@GetProjectAllAdmin');
    Route::post('AddProjectToLahan', 'Api\ProjectController@AddProjectToLahan');
    Route::post('AddNewProject', 'Api\ProjectController@AddNewProject');
    Route::post('UpdateDataProject', 'Api\ProjectController@UpdateDataProject');
    Route::post('ProjectActivator', 'Api\ProjectController@ProjectActivator');
    Route::post('addProjectPeriod', 'Api\ProjectController@addProjectPeriod');
    
    
    // Farmer
    Route::get('GetFarmerAllAdmin', 'Api\FarmerController@GetFarmerAllAdmin');
    Route::get('GetFarmerAllAdminDev', 'Api\FarmerController@GetFarmerAllAdminDev');
    Route::get('GetFarmerNoAll', 'Api\FarmerController@GetFarmerNoAll');
    Route::get('GetFarmerAll', 'Api\FarmerController@GetFarmerAll');
    Route::get('GetFarmerAllDesa', 'Api\FarmerController@GetFarmerAllDesa');
    Route::get('GetFarmerNotComplete', 'Api\FarmerController@GetFarmerNotComplete');
    Route::get('GetFarmerCompleteNotApprove', 'Api\FarmerController@GetFarmerCompleteNotApprove');
    Route::get('GetFarmerCompleteAndApprove', 'Api\FarmerController@GetFarmerCompleteAndApprove');
    Route::get('GetFarmerDetail', 'Api\FarmerController@GetFarmerDetail');
    Route::get('GetFarmerDetailWeb', 'Api\FarmerController@GetFarmerDetailWeb');
    Route::get('GetFarmerDetailKtpNo', 'Api\FarmerController@GetFarmerDetailKtpNo');
    Route::get('GetFarmerNoDropDown', 'Api\FarmerController@GetFarmerNoDropDown');
    Route::get('GetFarmerGroupsDropDown', 'Api\FarmerController@GetFarmerGroupsDropDown');
    Route::post('AddMandatoryFarmer', 'Api\FarmerController@AddMandatoryFarmer');
    
    Route::post('AddDetailFarmer', 'Api\FarmerController@AddDetailFarmer');
    Route::get('GetFarmerDetail', 'Api\FarmerController@GetFarmerDetail');
    
    Route::post('UpdateFarmer', 'Api\FarmerController@UpdateFarmer');
    Route::post('UpdateFarmerFF', 'Api\FarmerController@UpdateFarmerFF');
    Route::post('SoftDeleteFarmer', 'Api\FarmerController@SoftDeleteFarmer');
    Route::post('VerificationFarmer', 'Api\FarmerController@VerificationFarmer');
    Route::post('UnverificationFarmer', 'Api\FarmerController@UnverificationFarmer');
    Route::post('DeleteFarmer', 'Api\FarmerController@DeleteFarmer');
    Route::get('RemoveOldFarmer', 'Api\FarmerController@RemoveOldFarmer');
    Route::get('FarmerTrashedData', 'Api\FarmerController@FarmerTrashedData');
    Route::get('FarmerRestoreData', 'Api\FarmerController@FarmerRestoreData');
    // export farmer
    Route::post('ExportFarmerAllAdminNew', 'Api\FarmerController@ExportFarmerAllAdminNew');

    // Lahan
    Route::get('GetLahanAllAdmin', 'Api\LahanController@GetLahanAllAdmin');
    Route::get('GetLahanAllAdminNew', 'Api\LahanController@GetLahanAllAdminNew');
    Route::get('GetLahanAllAdminView', 'Api\LahanController@GetLahanAllAdminView');
    Route::get('GetLahanAll', 'Api\LahanController@GetLahanAll');
    Route::get('GetLahanAllDesa', 'Api\LahanController@GetLahanAllDesa');
    Route::get('GetLahanNotComplete', 'Api\LahanController@GetLahanNotComplete');
    Route::get('GetLahanFF', 'Api\LahanController@GetLahanFF');
    Route::get('GetLahanCompleteNotApprove', 'Api\LahanController@GetLahanCompleteNotApprove');
    Route::get('GetCompleteAndApprove', 'Api\LahanController@GetCompleteAndApprove');
    Route::get('GetLahanDetail', 'Api\LahanController@GetLahanDetail');
    Route::get('GetLahanDetailLahanNo', 'Api\LahanController@GetLahanDetailLahanNo');
    Route::get('GetLahanDetailBarcode', 'Api\LahanController@GetLahanDetailBarcode');
    Route::post('AddMandatoryLahan', 'Api\LahanController@AddMandatoryLahan');
    Route::post('AddMandatoryLahanComplete', 'Api\LahanController@AddMandatoryLahanComplete');
    Route::post('AddMandatoryLahanBarcode', 'Api\LahanController@AddMandatoryLahanBarcode');
    Route::get('GetLahanDetailTrees', 'Api\LahanController@GetLahanDetailTrees');
    Route::post('AddDetailLahan', 'Api\LahanController@AddDetailLahan');
    Route::post('DeleteDetailLahan', 'Api\LahanController@DeleteDetailLahan');
    Route::post('UpdateLahan', 'Api\LahanController@UpdateLahan');
    Route::post('UpdateLahanGIS', 'Api\LahanController@UpdateLahanGIS');
    Route::post('UpdateLahanStatusForceMajeure', 'Api\LahanController@UpdateLahanStatusForceMajeure');
    Route::post('VerificationLahan', 'Api\LahanController@VerificationLahan');
    Route::post('UnverificationLahan', 'Api\LahanController@UnverificationLahan');
    Route::post('SoftDeleteLahan', 'Api\LahanController@SoftDeleteLahan');
    Route::post('UpdateDetailLahanPohon', 'Api\LahanController@UpdateDetailLahanPohon');
    Route::post('UpdateProjectLahan', 'Api\LahanController@UpdateProjectLahan');
    Route::get('lahan-2', 'Api\LahanController@Lahan2Find');
    
    //TUTUPAN LAHAN
    Route::get('GetLahanTutupanRequestAllAdmin', 'Api\LahanTutupanController@GetLahanTutupanRequestAllAdmin');
    Route::get('GetDetailTutupanLahanRequest', 'Api\LahanTutupanController@GetDetailTutupanLahanRequest');
    Route::post('AddLahanTutupanRequest', 'Api\LahanTutupanController@AddLahanTutupanRequest');
    Route::post('UpdateLahanTutupanRequest', 'Api\LahanTutupanController@UpdateLahanTutupanRequest');
    Route::post('VerificationLahanTutupanFC', 'Api\LahanTutupanController@VerificationLahanTutupanFC');
    Route::post('VerificationLahanTutupanUM', 'Api\LahanTutupanController@VerificationLahanTutupanUM');
    Route::post('UnverificationLahanTutupan', 'Api\LahanTutupanController@UnverificationLahanTutupan');
    
    //LAHAN BARCODE
    Route::get('GetLahanBarcodeRequestAdmin', 'Api\LahanBarcodeController@GetLahanBarcodeRequestAdmin');
    Route::get('GetDetailBarcodeRequestLahan', 'Api\LahanBarcodeController@GetDetailBarcodeRequestLahan');
    Route::post('AddLahanBarcodeRequest', 'Api\LahanBarcodeController@AddLahanBarcodeRequest');
    Route::post('VerificationLahanBarcodeFC', 'Api\LahanBarcodeController@VerificationLahanBarcodeFC');
    Route::post('VerificationLahanBarcodeUM', 'Api\LahanBarcodeController@VerificationLahanBarcodeUM');
    Route::post('UnverificationBarcodeLahanRusak', 'Api\LahanBarcodeController@UnverificationBarcodeLahanRusak');
    
    // LAHAN UMUM
    Route::get('GetLahanUmumAllAdmin', 'Api\LahanUmumController@GetLahanUmumAllAdmin');
    Route::get('GetDetailLahanUmum', 'Api\LahanUmumController@GetDetailLahanUmum');
    Route::get('GetDetailLahanUmumMOU', 'Api\LahanUmumController@GetDetailLahanUmumMOU');
    Route::get('GetLahanUmumAll', 'Api\LahanUmumController@GetLahanUmumAll');
    Route::post('AddMandatoryLahanUmum', 'Api\LahanUmumController@AddMandatoryLahanUmum');
    Route::post('AddDetailLahanUmum', 'Api\LahanController@AddDetailLahanUmum');
    Route::post('UpdateLahanUmum', 'Api\LahanUmumController@UpdateLahanUmum');
    Route::post('UpdateHoleLahanUmum','Api\LahanUmumController@UpdateHoleLahanUmum');
    Route::post('VerificationLahanUmum', 'Api\LahanUmumController@VerificationLahanUmum');
    Route::post('PlantingHoleVerificationLahanUmum', 'Api\LahanUmumController@PlantingHoleVerificationLahanUmum');
    Route::post('UnverificationLahanUmum', 'Api\LahanUmumController@UnverificationLahanUmum');
    Route::post('SoftDeleteLahanUmum', 'Api\LahanUmumController@SoftDeleteLahanUmum');
    Route::post('UnverificationOneLahanUmum', 'Api\LahanUmumController@UnverificationOneLahanUmum');
    Route::post('CreateDistributionLahanUmum', 'Api\LahanUmumController@CreateDistributionLahanUmum');
    Route::get('GetUmumDistributionDetailReport', 'Api\LahanUmumController@GetUmumDistributionDetailReport');
    Route::get('GetUmumDistributionReport', 'Api\LahanUmumController@GetUmumDistributionReport');
    Route::get('GetUmumDistributionAdjustment', 'Api\LahanUmumController@GetUmumDistributionAdjustment');
    Route::post('DistributionVerificationPM', 'Api\LahanUmumController@DistributionVerificationPM');
    Route::post('CreateLahanUmumAdjustment', 'Api\LahanUmumController@CreateLahanUmumAdjustment');
    Route::post('UpdatedDistributionLahanUmum', 'Api\LahanUmumController@UpdatedDistributionLahanUmum');
    Route::post('UpdatedLoadingLahanUmum', 'Api\LahanUmumController@UpdatedLoadingLahanUmum');
    Route::get('GetLoadingLineLahanUmum', 'Api\LahanUmumController@GetLoadingLineLahanUmum');
    Route::get('GetLoadingLineDetailLahanUmum', 'Api\LahanUmumController@GetLoadingLineDetailLahanUmum');
    Route::get('GetMonitoringLahanUmumAdmin', 'Api\LahanUmumController@GetMonitoringLahanUmumAdmin');
    Route::get('GetMonitoringDetailLahanUmumAdmin', 'Api\LahanUmumController@GetMonitoringDetailLahanUmumAdmin');
    Route::post('CreateMonitoringLahanUmum', 'Api\LahanUmumController@CreateMonitoringLahanUmum');
    Route::post('UpdateMonitoringLahanUmum', 'Api\LahanUmumController@UpdateMonitoringLahanUmum');
    Route::post('SoftDeleteMonitoringLahanUmum', 'Api\LahanUmumController@SoftDeleteMonitoringLahanUmum');
    Route::post('DeleteMonitoringLahanUmum', 'Api\LahanUmumController@DeleteMonitoringLahanUmum');
    Route::post('ValidateMonitoringLahanUmum', 'Api\LahanUmumController@ValidateMonitoringLahanUmum');
    Route::post('UnverificationMonitoringLahanUmum', 'Api\LahanUmumController@UnverificationMonitoringLahanUmum');
    Route::post('MonitoringLahanUmumVerificationPM', 'Api\LahanUmumController@MonitoringLahanUmumVerificationPM');
    Route::post('CreateMonitoringLahanUmum', 'Api\LahanUmumController@CreateMonitoringLahanUmum');
    Route::post('UpdateMonitoringLahanUmum', 'Api\LahanUmumController@UpdateMonitoringLahanUmum');
    Route::post('DestroyLahanUmum', 'Api\LahanUmumController@DestroyLahanUmum');

    

    // TREES
    Route::get('GetTreesAll', 'Api\TreesController@GetTreesAll');
    Route::get('GetTreesLocation', 'Api\TreesController@GetTreesLocation');
    Route::post('AdjustTreesLocation', 'Api\TreesController@AdjustTreesLocation');
    Route::get('GetTrees', 'Api\TreesController@GetTrees');
    Route::get('GetTreesDetail', 'Api\TreesController@GetTreesDetail');
    Route::post('AddTrees', 'Api\TreesController@AddTrees');
    Route::post('UpdateTrees', 'Api\TreesController@UpdateTrees');
    Route::post('DeleteTrees', 'Api\TreesController@DeleteTrees');

    // Field Facilitator
    Route::get('GetFieldFacilitatorAllWeb', 'Api\FieldFacilitatorController@GetFieldFacilitatorAllWeb');
    Route::get('GetFieldFacilitatorAll', 'Api\FieldFacilitatorController@GetFieldFacilitatorAll');
    Route::get('GetFieldFacilitator', 'Api\FieldFacilitatorController@GetFieldFacilitator');
    Route::get('GetFieldFacilitatorDetail', 'Api\FieldFacilitatorController@GetFieldFacilitatorDetail');
    Route::get('getSingleDataFF', 'Api\FieldFacilitatorController@getSingleDataFF');
    Route::get('getFFbyVillage', 'Api\FieldFacilitatorController@getFFbyVillage');
    Route::get('getFFbyTA', 'Api\FieldFacilitatorController@getFFbyTA');
    Route::post('AddFieldFacilitator', 'Api\FieldFacilitatorController@AddFieldFacilitator');
    Route::post('UpdateFieldFacilitator', 'Api\FieldFacilitatorController@UpdateFieldFacilitator');
    Route::post('DeleteFieldFacilitator', 'Api\FieldFacilitatorController@DeleteFieldFacilitator');
    Route::post('NonactivateFieldFacilitator', 'Api\FieldFacilitatorController@NonactivateFieldFacilitator');
    Route::post('ChangeFCFieldFacilitator', 'Api\FieldFacilitatorController@ChangeFCFieldFacilitator');
    Route::post('UpdateEmailFieldFacilitator', 'Api\FieldFacilitatorController@UpdateEmailFieldFacilitator');
    
    Route::get('GetActivityUserId', 'Api\ActivityController@GetActivityUserId');
    Route::get('GetActivityLahanUser', 'Api\ActivityController@GetActivityLahanUser');
    Route::post('AddActivity', 'Api\ActivityController@AddActivity');
    Route::post('UpdateActivity', 'Api\ActivityController@UpdateActivity');
    Route::post('DeleteActivity', 'Api\ActivityController@DeleteActivity');
    Route::get('GetActivityDetail', 'Api\ActivityController@GetActivityDetail');
    Route::post('AddActivityDetail', 'Api\ActivityController@AddActivityDetail');
    Route::post('UpdateActivityDetail', 'Api\ActivityController@UpdateActivityDetail');
    Route::post('DeleteActivityDetail', 'Api\ActivityController@DeleteActivityDetail');

    // Sosialisasi Program & Form Minat
    Route::get('GetFormMinatAllAdmin', 'Api\FormMinatController@GetFormMinatAllAdmin');
    Route::get('GetFormMinatAll', 'Api\FormMinatController@GetFormMinatAll');
    Route::get('GetFormMinatDetail', 'Api\FormMinatController@GetFormMinatDetail');
    Route::post('AddFormMinat', 'Api\FormMinatController@AddFormMinat');
    Route::post('UpdateFormMinat', 'Api\FormMinatController@UpdateFormMinat');
    Route::post('DeleteFormMinat', 'Api\FormMinatController@DeleteFormMinat');
    Route::post('VerificationFormMinat', 'Api\FormMinatController@VerificationFormMinat');
    Route::post('UnverificationFormMinat', 'Api\FormMinatController@UnverificationFormMinat');

    Route::get('GetEmployeeAll', 'Api\EmployeeController@GetEmployeeAll');
    Route::get('GetEmployeebyManager', 'Api\EmployeeController@GetEmployeebyManager');
    Route::get('GetEmployeebyPosition', 'Api\EmployeeController@GetEmployeebyPosition');
    Route::get('GetFFbyUMandFC', 'Api\EmployeeController@GetFFbyUMandFC');
    Route::get('GetEmployeeManagePosition', 'Api\EmployeeController@GetEmployeeManagePosition');
    Route::get('GetEmployeebyFF', 'Api\EmployeeController@GetEmployeebyFF');
    Route::get('GetJobPosition', 'Api\EmployeeController@GetJobPosition');
    Route::post('EditPositionEmp', 'Api\EmployeeController@EditPositionEmp');
    Route::get('GetEmployeeMenuAccess', 'Api\EmployeeController@GetEmployeeMenuAccess');
    Route::post('EditMenuAccessEmp', 'Api\EmployeeController@EditMenuAccessEmp');
    Route::post('AddEmployee', 'Api\EmployeeController@AddEmployee');
    Route::post('EditEmployee', 'Api\EmployeeController@EditEmployee');
    Route::post('DeleteEmployee', 'Api\EmployeeController@DeleteEmployee');

    // Sosialisasi Tanam
    Route::get('GetSocAllAdmin', 'Api\SosialisasiTanamController@GetSocAllAdmin');
    Route::get('GetSosisalisasiTanamAdmin', 'Api\SosialisasiTanamController@GetSosisalisasiTanamAdmin');
    // Route::get('GetSosisalisasiTanamAdminLimit', 'Api\SosialisasiTanamController@GetSosisalisasiTanamAdminLimit');
    Route::get('GetSosisalisasiTanamTimeAll', 'Api\SosialisasiTanamController@GetSosisalisasiTanamTimeAll');
    Route::get('GetSosisalisasiTanamFF', 'Api\SosialisasiTanamController@GetSosisalisasiTanamFF');
    Route::get('GetDetailSosisalisasiTanam', 'Api\SosialisasiTanamController@GetDetailSosisalisasiTanam');
    Route::get('GetDetailSosisalisasiTanamFFNo', 'Api\SosialisasiTanamController@GetDetailSosisalisasiTanamFFNo');
    Route::get('GetOpsiPolaTanamOptions', 'Api\SosialisasiTanamController@GetOpsiPolaTanamOptions');
    Route::post('AddSosisalisasiTanam', 'Api\SosialisasiTanamController@AddSosisalisasiTanam');
    Route::post('UpdateSosisalisasiTanam', 'Api\SosialisasiTanamController@UpdateSosisalisasiTanam');
    Route::post('UpdatePohonSosisalisasiTanam', 'Api\SosialisasiTanamController@UpdatePohonSosisalisasiTanam');
    Route::post('SoftDeleteSosisalisasiTanam', 'Api\SosialisasiTanamController@SoftDeleteSosisalisasiTanam');
    Route::post('ValidateSosisalisasiTanam', 'Api\SosialisasiTanamController@ValidateSosisalisasiTanam');
    Route::post('UnverificationSosialisasiTanam', 'Api\SosialisasiTanamController@UnverificationSosialisasiTanam');
    Route::post('createLogSostamCheck', 'Api\SosialisasiTanamController@createLogSostamCheck');
    Route::get('getFFOptionsSostam', 'Api\SosialisasiTanamController@getFFOptionsSostam');
    Route::get('getFFLahanSostam', 'Api\SosialisasiTanamController@getFFLahanSostam');
    Route::get('getFFLahanSostamNew', 'Api\SosialisasiTanamController@getFFLahanSostamNew');
    Route::post('createSostamByFF', 'Api\SosialisasiTanamController@createSostamByFF');
    Route::post('UpdateSosialisasiTanamPeriod', 'Api\SosialisasiTanamController@UpdateSosialisasiTanamPeriod');
    Route::post('deleteSosialisasiTanamForm', 'Api\SosialisasiTanamController@deleteSosialisasiTanamForm');
    Route::post('deleteSosialisasiTanamPeriod', 'Api\SosialisasiTanamController@deleteSosialisasiTanamPeriod');
    Route::post('createSosialisasiTanamPeriod', 'Api\SosialisasiTanamController@createSosialisasiTanamPeriod');
    Route::post('UpdatePetaniSusulan', 'Api\SosialisasiTanamController@UpdatePetaniSusulan');
    Route::post('UpdateAbsenSosialisasi', 'Api\SosialisasiTanamController@UpdateAbsenSosialisasi');
    Route::post('UpdateDistributionTime', 'Api\SosialisasiTanamController@UpdateDistributionTime');
    Route::post('UpdateCoordinatebyGis', 'Api\SosialisasiTanamController@UpdateCoordinatebyGis');
    
    //Sostam Adjustment
    Route::get('GetSocializationAdjustmentAll', 'Api\SocializationAdjustmentController@GetSocializationAdjustmentAll');
    Route::get('GetSocializationAdjustmentDetail', 'Api\SocializationAdjustmentController@GetSocializationAdjustmentDetail');
    Route::post('AddAdjustment', 'Api\SocializationAdjustmentController@AddAdjustment');
    Route::post('AdjustmentValidation', 'Api\SocializationAdjustmentController@AdjustmentValidation');
    Route::post('AdjustmentUnvalidation', 'Api\SocializationAdjustmentController@AdjustmentUnvalidation');
    Route::post('DeleteAdjustment', 'Api\SocializationAdjustmentController@DeleteAdjustment');
    
    
    Route::get('/ExportSostamAllSuperAdmin', 'Api\SosialisasiTanamController@ExportSostamAllSuperAdmin');
    
    Route::get('ExportSostamSuperAdmin', 'Api\SosialisasiTanamController@ExportSostamSuperAdmin');
    
    // API For Nursery
        // permintaan tanggal distribusi
    Route::get('GEKO_GetSosisalisasiTanamAdminLimit', 'Api\NurseryController@GEKO_GetSosisalisasiTanamAdminLimit');
    Route::get('SostamDetailForNursery', 'Api\NurseryController@SostamDetailForNursery');
    Route::get('SostamEventForNursery', 'Api\NurseryController@SostamEventForNursery');
    Route::post('ApprovalRequestDateNursery', 'Api\NurseryController@ApprovalRequestDateNursery');
        // pre-alokasi distribusi
    Route::get('GetListFFPerDateDistribution', 'Api\NurseryController@GetListFFPerDateDistribution');
    Route::get('SeedTotalAdjustmentPerNursery', 'Api\NurseryController@SeedTotalAdjustmentPerNursery');
        // penlub 
    Route::get('GEKO_NurseryGetPlantingHole', 'Api\NurseryController@NurseryGetPlantingHole');
    Route::get('GEKO_getPrintLabelList', 'Api\NurseryController@GEKO_getPrintLabelList');
    Route::get('NurseryDetailPlantingHole', 'Api\NurseryController@NurseryDetailPlantingHole');
        // distribution
    Route::get('GEKO_getLoadingLine', 'Api\DistributionController@GEKO_getLoadingLine');

    //Planting Hole
    Route::get('GetPlantingHoleAdmin', 'Api\PlantingHoleController@GetPlantingHoleAdmin');
    Route::get('GetPlantingHoleAdminNew', 'Api\PlantingHoleController@GetPlantingHoleAdminNew');
    Route::get('GetPlantingHoleFF', 'Api\PlantingHoleController@GetPlantingHoleFF');
    Route::get('GetPlantingHoleDetail', 'Api\PlantingHoleController@GetPlantingHoleDetail');
    Route::get('GetPlantingHoleDetailFFNo', 'Api\PlantingHoleController@GetPlantingHoleDetailFFNo');
    Route::post('AddPlantingHole', 'Api\PlantingHoleController@AddPlantingHole');
    Route::post('AddPlantingHoleByFFNo', 'Api\PlantingHoleController@AddPlantingHoleByFFNo');
    Route::post('UpdatePlantingHole', 'Api\PlantingHoleController@UpdatePlantingHole');
    Route::post('UpdatePlantingHoleAll', 'Api\PlantingHoleController@UpdatePlantingHoleAll');
    Route::post('UpdatePohonPlantingHole', 'Api\PlantingHoleController@UpdatePohonPlantingHole');
    Route::post('SoftDeletePlantingHole', 'Api\PlantingHoleController@SoftDeletePlantingHole');
    Route::post('ValidatePlantingHole', 'Api\PlantingHoleController@ValidatePlantingHole');
    Route::post('UnvalidatePlantingHole', 'Api\PlantingHoleController@UnvalidatePlantingHole');
    Route::post('UnverificationPerFF', 'Api\PlantingHoleController@UnverificationPerFF');
    Route::get('CheckedPlantingHole', 'Api\PlantingHoleController@CheckedPlantingHole');
    Route::get('GetPlantingHoleLahanUmumAdmin', 'Api\PlantingHoleController@GetPlantingHoleLahanUmumAdmin');
    Route::get('GetPlantingHoleLahanUmumDetail', 'Api\PlantingHoleController@GetPlantingHoleLahanUmumDetail');
    
    Route::get('NurseryCheckDistributionBAST', 'Api\NurseryController@NurseryCheckDistributionBAST');
    
    Route::get('NurseryGetPlantingHoleFF', 'Api\NurseryController@NurseryGetPlantingHoleFF');
    
    // Export Planting Hole
    Route::get('/ExportExcelPenilikanLubang', 'Api\PlantingHoleController@ExportExcelPenilikanLubang');
    
    

    //Monitoring
    Route::get('GetExportMonitoringAllAdmin', 'Api\MonitoringController@GetExportMonitoringAllAdmin');
    Route::get('GetMonitorings1AllAdmin', 'Api\MonitoringController@GetMonitorings1AllAdmin');
    Route::get('GetMonitoringFF', 'Api\MonitoringController@GetMonitoringFF');
    Route::get('GetMonitoringAdmin', 'Api\MonitoringController@GetMonitoringAdmin');
    Route::get('GetMonitoringDetail', 'Api\MonitoringController@GetMonitoringDetail'); 
    Route::get('GetMonitoringDetailFFNo', 'Api\MonitoringController@GetMonitoringDetailFFNo'); 
    Route::get('GetMonitoringTest', 'Api\MonitoringController@GetMonitoringTest');    
    Route::post('AddMonitoring', 'Api\MonitoringController@AddMonitoring');
    Route::post('AddMonitoringNew', 'Api\MonitoringController@AddMonitoringNew');
    Route::post('UpdateMonitoring', 'Api\MonitoringController@UpdateMonitoring');
    Route::post('UpdatePohonMonitoring', 'Api\MonitoringController@UpdatePohonMonitoring');
    Route::post('SoftDeleteMonitoring', 'Api\MonitoringController@SoftDeleteMonitoring');
    Route::post('DeleteMonitoring', 'Api\MonitoringController@DeleteMonitoring');
    Route::post('ValidateMonitoring', 'Api\MonitoringController@ValidateMonitoring');
    Route::post('MonitoringVerificationUM', 'Api\MonitoringController@MonitoringVerificationUM');
    Route::post('UnverificationMonitoring', 'Api\MonitoringController@UnverificationMonitoring');
    Route::post('UpdateSPPTMonitoring', 'Api\MonitoringController@UpdateSPPTMonitoring');
    Route::post('RefreshMonitoringPhotoAndDesc', 'Api\MonitoringController@RefreshMonitoringPhotoAndDesc');
    
    //Monitoring 1 Populate Data
    Route::get('GetMonitoring1PopulateByTA', 'Api\Monitoring1PopulateController@GetMonitoring1PopulateByTA');
    Route::get('GetDetailPopulatedMonitoring1', 'Api\Monitoring1PopulateController@GetDetailPopulatedMonitoring1');
    Route::get('GetTAForPopulateMonitoring1', 'Api\Monitoring1PopulateController@GetTAForPopulateMonitoring1');
    Route::post('AddMonitoring1Populate', 'Api\Monitoring1PopulateController@AddMonitoring1Populate');
    Route::post('AssignedToFF', 'Api\Monitoring1PopulateController@AssignedToFF');
    Route::post('UpdateDataPopulate1', 'Api\Monitoring1PopulateController@UpdateDataPopulate');
    Route::post('resetDataPopulated', 'Api\Monitoring1PopulateController@resetDataPopulated');
    Route::get('GetFFNow', 'Api\Monitoring1PopulateController@GetFFNow');
    Route::post('deletePopulate1Datas', 'Api\Monitoring1PopulateController@deletePopulate1Datas');
    
    //Monitoring 2
    Route::get('GetMonitoring2FF', 'Api\MonitoringController@GetMonitoring2FF');
    Route::get('GetMonitoring2Admin', 'Api\MonitoringController@GetMonitoring2Admin');
    Route::get('GetMonitoring2Detail', 'Api\MonitoringController@GetMonitoring2Detail'); 
    Route::get('GetMonitoring2DetailFFNo', 'Api\MonitoringController@GetMonitoring2DetailFFNo'); 
    Route::post('AddMonitoring2', 'Api\MonitoringController@AddMonitoring2');
    Route::post('UpdateMonitoring2', 'Api\MonitoringController@UpdateMonitoring2');
    Route::post('UpdatePohonMonitoring2', 'Api\MonitoringController@UpdatePohonMonitoring2');
    Route::post('SoftDeleteMonitoring2', 'Api\MonitoringController@SoftDeleteMonitoring2');
    Route::post('ValidateMonitoring2', 'Api\MonitoringController@ValidateMonitoring2');
    Route::post('UnvalidateMonitoring2', 'Api\MonitoringController@UnvalidateMonitoring2');
    // Monitoring 2 NEW
    Route::get('ShowTotalTreesGeneral', 'Api\Monitoring2Controller@ShowTotalTreesGeneral');
    Route::get('ShowListLandPerTreeCode', 'Api\Monitoring2Controller@ShowListLandPerTreeCode');
    Route::get('GetTAForMonitoring2', 'Api\Monitoring2Controller@GetTAForMonitoring2');
    Route::get('GetMonitoring2ByTA', 'Api\Monitoring2Controller@GetMonitoring2ByTA');
    Route::get('GetNewMonitoring2Detail', 'Api\Monitoring2Controller@GetNewMonitoring2Detail');
    Route::post('deleteMonitoring2Datas', 'Api\Monitoring2Controller@deleteMonitoring2Datas');
    Route::post('UpdateTreeCategoryMonitoring2', 'Api\Monitoring2Controller@UpdateTreeCategoryMonitoring2');
    // Monitoring 2 Dev Test
    Route::post('AddMonitoring2New', 'Api\Monitoring2Controller@AddMonitoring2New');
    Route::get('GetMonitoring2ByTANew', 'Api\Monitoring2Controller@GetMonitoring2ByTANew');
    Route::get('GetNewMonitoring2DetailNew', 'Api\Monitoring2Controller@GetNewMonitoring2DetailNew');
    Route::post('deleteMonitoring2DatasNew', 'Api\Monitoring2Controller@deleteMonitoring2DatasNew');
    Route::post('ValidateMonitoring2New', 'Api\Monitoring2Controller@ValidateMonitoring2New');
    Route::post('UMValidateMonitoring2', 'Api\Monitoring2Controller@UMValidateMonitoring2');
    Route::get('ExportFFMonitoring2', 'Api\Monitoring2Controller@ExportFFMonitoring2');
    
    // Monitoring 2 Populate Data (langkah)
    Route::get('GetMonitoring2PopulateByTA', 'Api\Monitoring2PopulateController@GetMonitoring2PopulateByTA');
    Route::post('AddMonitoring1PopulateTo2', 'Api\Monitoring2PopulateController@AddMonitoring1PopulateTo2');
    Route::post('UpdateDataPopulate2', 'Api\Monitoring2PopulateController@UpdateDataPopulate');
    Route::post('resetDataPopulated2', 'Api\Monitoring2PopulateController@resetDataPopulated');
    
    
    //Monitoring 3
    Route::post('AddMonitoring3', 'Api\Monitoring3Controller@AddMonitoring3');
    Route::get('GetMonitoring3ByTA', 'Api\Monitoring3Controller@GetMonitoring3ByTA');
    Route::get('GetNewMonitoring3Detail', 'Api\Monitoring3Controller@GetNewMonitoring3Detail');
    Route::post('ValidateMonitoring3', 'Api\Monitoring3Controller@ValidateMonitoring3');
    Route::post('deleteMonitoring3Datas', 'Api\Monitoring3Controller@deleteMonitoring3Datas');
    Route::get('GetMonitoring3FF', 'Api\Monitoring3Controller@GetMonitoring3FF');
    Route::get('ExportFFMonitoring3', 'Api\Monitoring3Controller@ExportFFMonitoring3');
    Route::post('UpdateTreeCategoryMonitoring3', 'Api\Monitoring3Controller@UpdateTreeCategoryMonitoring3');

    Route::post('UpdateMonitoring3', 'Api\Monitoring3Controller@UpdateMonitoring3');
    
    // Monitoring 3 Populate Data
    Route::post('AddMonitoringPopulateTo3', 'Api\Monitoring3PopulateController@AddMonitoringPopulateTo3');
    Route::post('AddMonitoringPopulateTo3Single', 'Api\Monitoring3PopulateController@AddMonitoringPopulateTo3Single');
    
    
    //Monitoring 4
    Route::get('GetMonitoring4FF', 'Api\Monitoring4Controller@GetMonitoring4FF');
    Route::get('GetNewMonitoring4Detail', 'Api\Monitoring4Controller@GetNewMonitoring4Detail');
    Route::get('GetMonitoring4ByTA'. 'Api\Monitoring4Controller@GetMonitoring4ByTA');
    Route::post('AddMonitoring4', 'Api\Monitoring4Controller@AddMonitoring4');
    Route::post('UpdateMonitoring4', 'Api\Monitoring4Controller@UpdateMonitoring4');
    Route::post('ValidateMonitoring4', 'Api\Monitoring4Controller@ValidateMonitoring4');
    
    // Farmer Training Routers
    Route::get('GetDesaFarmerTraining', 'Api\FarmerTrainingController@GetDesaFarmerTraining');
    Route::get('GetFFDesa', 'Api\FarmerTrainingController@GetFFDesa');
    Route::get('GetTargetAreaByManager', 'Api\FarmerTrainingController@GetTargetAreaByManager');
    Route::get('GetFarmerTrainingAllAdmin', 'Api\FarmerTrainingController@GetFarmerTrainingAllAdmin');
    Route::get('DetailFarmerTraining', 'Api\FarmerTrainingController@DetailFarmerTraining');
    Route::get('GetFarmerTrainingAll', 'Api\FarmerTrainingController@GetFarmerTrainingAll');
    Route::get('GetFarmerTrainingAllTempDelete', 'Api\FarmerTrainingController@GetFarmerTrainingAllTempDelete');
    Route::post('AddFarmerTraining', 'Api\FarmerTrainingController@AddFarmerTraining');
    Route::post('UpdateFarmerTraining', 'Api\FarmerTrainingController@UpdateFarmerTraining');
    Route::post('AddDetailFarmerTraining', 'Api\FarmerTrainingController@AddDetailFarmerTraining');
    Route::post('UpdateFarmerTraining', 'Api\FarmerTrainingController@UpdateFarmerTraining');
    Route::post('DeleteFarmerTrainingDetail', 'Api\FarmerTrainingController@DeleteFarmerTrainingDetail');
    Route::post('SoftDeleteFarmerTraining', 'Api\FarmerTrainingController@SoftDeleteFarmerTraining');
    Route::post('DeleteFarmerTraining', 'Api\FarmerTrainingController@DeleteFarmerTraining');
    Route::post('UploadExternalFarmerTraining', 'Api\FarmerTrainingController@TrialUploadPhotoExternal');
    Route::get('GetTrainingMaterials', 'Api\FarmerTrainingController@GetTrainingMaterials');
    Route::post('VerificationFarmerTraining', 'Api\FarmerTrainingController@VerificationFarmerTraining');
    Route::post('UnverificationFarmerTraining', 'Api\FarmerTrainingController@UnverificationFarmerTraining');
    // Export Farmer Training 
    // Route::get('/api/ExportFarmerTraining', 'Api\FarmerTrainingController@ExportFarmerTraining');
    
    
    // Organic
    Route::get('GetOrganicAll', 'Api\OrganicController@GetOrganicAll');
    Route::get('GetOrganicAllAdmin', 'Api\OrganicController@GetOrganicAllAdmin');
    Route::get('GetOrganicFF', 'Api\OrganicController@GetOrganicFF');
    Route::post('AddOrganic', 'Api\OrganicController@AddOrganic');
    Route::post('UpdateOrganic', 'Api\OrganicController@UpdateOrganic');
    Route::post('SoftDeleteOrganic', 'Api\OrganicController@SoftDeleteOrganic');
    Route::post('DeleteOrganic', 'Api\OrganicController@DeleteOrganic');
    Route::post('ValidateOrganic', 'Api\OrganicController@ValidateOrganic');
    Route::post('UnvalidateOrganic', 'Api\OrganicController@UnvalidateOrganic');
    
    // KPI
    Route::get('KPIFF', 'Api\KPIController@ByFF');
    Route::get('KPIFC', 'Api\KPIController@ByFC');
    Route::get('KPIFCDev', 'Api\KPIController@ByFCDev');
    Route::get('KPIUM', 'Api\KPIController@ByUM');
    Route::get('KPIUMDev', 'Api\KPIController@ByUMDev');

    // Distribution
    Route::get('ExportCoordinateDistribution', 'Api\DistributionController@ExportCoordinateDistribution');
    Route::get('GetDistributionSimple', 'Api\DistributionController@GetDistributionSimple');
    Route::get('DistributionCalendar', 'Api\DistributionController@DistributionCalendar');
    Route::get('DistributionCalendarLahanUmum', 'Api\DistributionController@DistributionCalendarLahanUmum');
    Route::get('DistributionSeedDetail', 'Api\DistributionController@DistributionSeedDetail');
    Route::get('DistributionPeriodDetail', 'Api\DistributionController@DistributionPeriodDetail');
    Route::get('DistributionPeriodLahanUmumDetail', 'Api\DistributionController@DistributionPeriodLahanUmumDetail');
    Route::post('UpdateLahanUmumPeriod', 'Api\DistributionController@UpdateLahanUmumPeriod');
    Route::get('GetDistributionFF', 'Api\DistributionController@GetDistributionFF');
    Route::post('UpdateDistribution', 'Api\DistributionController@UpdateDistribution');
    Route::post('CompletedDistribution', 'Api\DistributionController@CompletedDistribution');
    Route::post('LoadedDistribution', 'Api\DistributionController@LoadedDistribution');
    Route::post('FinishLoadingBagsDistributions', 'Api\DistributionController@FinishLoadingBagsDistributions');
    Route::get('GetDistributionReport', 'Api\DistributionController@GetDistributionReport');
    Route::get('GetDetailDistributionReport', 'Api\DistributionController@GetDetailDistributionReport');
    Route::post('CreateAdjustment', 'Api\DistributionController@CreateAdjustment');
    Route::post('UnverificationDistribution', 'Api\DistributionController@UnverificationDistribution');
    Route::post('DistributionVerificationUM', 'Api\DistributionController@DistributionVerificationUM');

    // SeedlingChangeRequest
    Route::get('SeedlingChangeRequest/GetMU', 'Api\SeedlingChangeRequestController@GetMU');
    Route::get('SeedlingChangeRequest/GetFF', 'Api\SeedlingChangeRequestController@GetFF');
    Route::get('SeedlingChangeRequest/GetFarmer', 'Api\SeedlingChangeRequestController@GetFarmer');
    Route::get('SeedlingChangeRequest/GetLand', 'Api\SeedlingChangeRequestController@GetLand');
    Route::get('SeedlingChangeRequest/GetLandDetail', 'Api\SeedlingChangeRequestController@GetLandDetail');
    Route::get('SeedlingChangeRequest/GetTreesPerMU', 'Api\SeedlingChangeRequestController@GetTreesPerMU');
    Route::get('SeedlingChangeRequest/GetRequests', 'Api\SeedlingChangeRequestController@GetRequests');
    Route::get('SeedlingChangeRequest/DetailRequest', 'Api\SeedlingChangeRequestController@DetailRequest');
    Route::post('SeedlingChangeRequest/AddRequest', 'Api\SeedlingChangeRequestController@AddRequest');
    Route::post('SeedlingChangeRequest/Verification', 'Api\SeedlingChangeRequestController@Verification');
    Route::post('SeedlingChangeRequest/Reject', 'Api\SeedlingChangeRequestController@Reject');
    Route::post('SeedlingChangeRequest/Cancel', 'Api\SeedlingChangeRequestController@Cancel');
    
    // Packing Label
    Route::get('GetPackingLabelByLahan', 'Api\DistributionController@GetPackingLabelByLahan');
    Route::get('GetPackingLabelLahanUmum', 'Api\DistributionController@GetPackingLabelLahanUmum');
    Route::get('GetPackingLabelByLahanTemp', 'Api\DistributionController@GetPackingLabelByLahanTemp');
    // Loading Line
    Route::get('GetLoadingLine', 'Api\DistributionController@GetLoadingLine');
    Route::get('GetLoadingLineDetailFF', 'Api\DistributionController@GetLoadingLineDetailFF');
    Route::post('LoadedDistributionBagsNumber', 'Api\DistributionController@LoadedDistributionBagsNumber');
    
    //Driver & Truck
    Route::get('GetDriver', 'Api\TransportationController@GetDriver');
    Route::get('GetDetailDriver', 'Api\TransportationController@GetDetailDriver');
    Route::post('AddDriver', 'Api\TransportationController@AddDriver');
    Route::post('UpdateDriver', 'Api\TransportationController@UpdateDriver');
    Route::post('DeleteDriver', 'Api\TransportationController@DeleteDriver');
    Route::get('GetTruck', 'Api\TransportationController@GetTruck');
    Route::get('GetDetailTruck', 'Api\TransportationController@GetDetailTruck');
    Route::post('AddTruck', 'Api\TransportationController@AddTruck');
    Route::post('UpdateTruck', 'Api\TransportationController@UpdateTruck');
    Route::post('DeleteTruck', 'Api\TransportationController@DeleteTruck');
    
    // Temporary
    Route::get('fixNullMaxSeedAmountSosialisasiTanam', 'Api\TemporaryController@fixNullMaxSeedAmountSosialisasiTanam');
    Route::get('getTopTreesSosialisasiTanam', 'Api\TemporaryController@getTopTreesSosialisasiTanam');
    Route::get('GetDistributedLabel', 'Api\TemporaryController@GetDistributedLabel');
    Route::get('GetDistributionReportFull', 'Api\TemporaryController@GetDistributionReport');
    Route::get('GetDistributionReportFullPerFF', 'Api\TemporaryController@GetDistributionReportPerFF');
    Route::post('UpdateLatLongLahan', 'Api\TemporaryController@updateLatLongLahan');
    Route::post('MassUpdateLatLongLahan', 'Api\TemporaryController@MassUpdateLatLongLahan');
    Route::post('UpdateLatLongLahanTemp', 'Api\TemporaryController@updateLatLongLahanTemp');
    Route::get('CheckLahan', 'Api\TemporaryController@CheckLahan');
    Route::get('getDataLahanRequestMbakNovi', 'Api\TemporaryController@getDataLahanRequestMbakNovi');
    Route::get('RequestDataMbakAnin', 'Api\TemporaryController@RequestDataMbakAnin');
    Route::get('GetSurvivalRate', 'Api\TemporaryController@GetSurvivalRate');
    Route::get('setLoadAndDistributeData', 'Api\TemporaryController@setLoadAndDistributeData');
    // Route::get('GetDataLahanByDocumentSPPT', 'Api\TemporaryController@GetDataLahanByDocumentSPPT');
    Route::post('DeleteDuplicatedVillage', 'Api\TemporaryController@DeleteDuplicatedVillage');
        // Export data
    Route::get('TempGetFarmerNoPeriod', 'Api\TemporaryController@TempGetFarmerNoPeriod');
    Route::post('TempExportFarmer', 'Api\TemporaryController@TempExportFarmer');
    Route::get('TempGetLahanNoSppt', 'Api\TemporaryController@TempGetLahanNoSppt');
    Route::post('TempGetLahanSppt', 'Api\TemporaryController@TempGetLahanSppt');
    Route::get('TempGetLahanAll', 'Api\TemporaryController@TempGetLahanAll');
    Route::get('TempGetLahanFields', 'Api\TemporaryController@TempGetLahanFields');
    Route::post('TempGetLahanSeeds', 'Api\TemporaryController@TempGetLahanSeeds');
    Route::post('TempGetLahanCompleteWithoutSeeds', 'Api\TemporaryController@TempGetLahanCompleteWithoutSeeds');
    Route::get('TempExportSostam', 'Api\TemporaryController@TempExportSostam');
    Route::get('TempExportMonitoring', 'Api\TemporaryController@TempExportMonitoring');
    Route::get('TempExportMonitoring2', 'Api\TemporaryController@TempExportMonitoring2');
    Route::get('NewTempExportMonitoring2', 'Api\TemporaryController@NewTempExportMonitoring2');
    Route::get('TempExportMonitoring3', 'Api\TemporaryController@TempExportMonitoring3');
    
    // NEW GEKOOOOOOOO :'D
    // main project
    Route::post('deleteProject', 'Api\ProjectController@deleteProject');
    // project utils
    Route::post('addProjectUtils', 'Api\ProjectController@addProjectUtils');
    Route::get('getAllProjectUtils', 'Api\ProjectController@getAllProjectUtils');
    Route::get('getDetailProjectUtils', 'Api\ProjectController@getDetailProjectUtils');
    Route::post('updateProjectUtils', 'Api\ProjectController@updateProjectUtils');
    Route::post('deleteProjectUtils', 'Api\ProjectController@deleteProjectUtils');
    
    // Region
    Route::get('getRegion', 'Api\RegionController@getRegion');
    Route::post('createRegion', 'Api\RegionController@createRegion');
    Route::post('deleteRegion', 'Api\RegionController@deleteRegion');
    Route::post('trashRegion', 'Api\RegionController@trashRegion');
    
    
    // Master Area
    Route::post('addMasterAreaDatas', 'Api\MasterAreaController@addMasterAreaDatas');
    
    
    
    // NEW ACTIVITIES
    // scooping visit
        Route::get('GetNewScoopingAll', 'Api\RraPraController@GetNewScoopingAll');
        
        Route::post('AddScoopingVisit_new', 'Api\RraPraController@AddScoopingVisit_new');
        Route::post('AddScoopingVisitFigures_new', 'Api\RraPraController@AddScoopingVisitFigures_new');
        Route::post('AddScoopingVisitFFCandidate_new', 'Api\RraPraController@AddScoopingVisitFFCandidate_new');
        Route::post('AddScoopingVisitNGOCompetitor_new', 'Api\RraPraController@AddScoopingVisitNGOCompetitor_new');
        Route::post('AddScoopingProject_new', 'Api\RraPraController@AddScoopingProject_new');
        
        Route::post('UpdateScoopingVisit_new', 'Api\RraPraController@UpdateScoopingVisit_new');
        Route::post('UpdateScoopingVisitFigures_new', 'Api\RraPraController@UpdateScoopingVisitFigures_new');
        Route::post('UpdateScoopingVisitFFCandidate_new', 'Api\RraPraController@UpdateScoopingVisitFFCandidate_new');

        Route::get('GetDetailScoopingVisit_new', 'Api\RraPraController@GetDetailScoopingVisit_new');
        Route::get('GetDetailScoopingVisitFigures_new', 'Api\RraPraController@GetDetailScoopingVisitFigures_new');
        Route::get('GetDetailScoopingVisitFFCandidate_new', 'Api\RraPraController@GetDetailScoopingVisitFFCandidate_new');
        Route::get('GetDetailScoopingVisitNGOCompetitor_new', 'Api\RraPraController@GetDetailScoopingVisitNGOCompetitor_new');
        Route::get('GetDetailScoopingVistiProject_new', 'Api\RraPraController@GetDetailScoopingVistiProject_new');

        Route::post('UpdateVerifScoopingVisit_new', 'Api\RraPraController@UpdateVerifScoopingVisit_new');
        Route::post('UpdateVerifScoopingVisitGIS_new', 'Api\RraPraController@UpdateVerifScoopingVisitGIS_new');
        Route::post('UpdateScoopingVisitProject_new', 'Api\RraPraController@UpdateScoopingVisitProject_new');

        Route::post('DeleteScoopingVisit_new', 'Api\RraPraController@DeleteScoopingVisit_new');
        Route::post('DeleteScoopingVisitFigures_new', 'Api\RraPraController@DeleteScoopingVisitFigures_new');
        Route::post('DeleteScoopingVisitProject_new', 'Api\RraPraController@DeleteScoopingVisitProject_new');
        Route::post('DeleteScoopingVisitFFCandidate_new', 'Api\RraPraController@DeleteScoopingVisitFFCandidate_new');

        Route::post('LogRequest', 'Api\LogController@LogRequest');
        
    //RRA-PRA
            Route::get('GetRraAll_new', 'Api\RraPraController@GetRraAll_new');
            Route::get('testRRAGetter_test', 'Api\RraPraController@testRRAGetter_test');
            Route::get('GetDetailRraPra_new', 'Api\RraPraController@GetDetailRraPra_new');
            Route::post('deleteRraPra_new', 'Api\RraPraController@deleteRraPra_new');

        //add rra
            Route::post('addMainRra_new', 'Api\RraPraController@addMainRra_new');
            Route::post('addRraVillageBorder_new', 'Api\RraPraController@addRraVillageBorder_new');
            Route::post('addRraLandUse_new', 'Api\RraPraController@addRraLandUse_new');
            Route::post('addRraExistingPlant_new', 'Api\RraPraController@addRraExistingPlant_new');
            Route::post('addRraComunityInstitution_new', 'Api\RraPraController@addRraComunityInstitution_new');
            Route::post('addRraOrganicPotentials_new', 'Api\RraPraController@addRraOrganicPotentials_new');
            Route::post('addRraProductionMarketing_new', 'Api\RraPraController@addRraProductionMarketing_new');
            Route::post('addRraInnovativeFarmer_new', 'Api\RraPraController@addRraInnovativeFarmer_new');
            Route::post('addRraDusun_new', 'Api\RraPraController@addRraDusun_new');
        //update rra
            Route::post('updateMainRra_new', 'Api\RraPraController@updateMainRra_new');
    
        //add pra
            Route::post('addMainPra_new', 'Api\RraPraController@addMainPra_new');
            Route::post('addPraDisasterDetail_new', 'Api\RraPraController@addPraDisasterDetail_new');
            Route::post('addPraFretilizerDetail_new', 'Api\RraPraController@addPraFretilizerDetail_new');
            Route::post('addPraPesticideDetail_new', 'Api\RraPraController@addPraPesticideDetail_new');
            Route::post('addPraDryLandSpreads_new', 'Api\RraPraController@addPraDryLandSpreads_new');
            Route::post('addPraLandOwnership_new', 'Api\RraPraController@addPraLandOwnership_new');
            Route::post('addPraWaterSource_new', 'Api\RraPraController@addPraWaterSource_new');
            Route::post('addPraExistingProblem_new', 'Api\RraPraController@addPraExistingProblem_new');
            Route::post('addPraFarmerIncome_new', 'Api\RraPraController@addPraFarmerIncome_new');
            Route::post('addSocialImpactFaunaDetails_new', 'Api\RraPraController@addSocialImpactFaunaDetails_new');
            Route::post('addSocialImpactFloraDetails_new', 'Api\RraPraController@addSocialImpactFloraDetails_new');
    
    // SOSIALISASI PROGRAM
        Route::get('GetFormMinatAll_new', 'Api\FormMinatController@GetFormMinatAll_new');
        Route::get('GetFormMinatDetailAll_new', 'Api\FormMinatController@GetFormMinatDetailAll_new');
        Route::get('GetFormMinatDetailFarmer_new', 'Api\FormMinatController@GetFormMinatDetailFarmer_new');
        Route::get('GetFormMinatBulkData_new', 'Api\FormMinatController@GetFormMinatBulkData_new');
        
        
    
        Route::post('AddFormMinatMain_new', 'Api\FormMinatController@AddFormMinatMain_new');
        Route::post('AddFormMinatFarmers_new', 'Api\FormMinatController@AddFormMinatFarmers_new');
    
        Route::post('UpdateFormMinatMain_new', 'Api\FormMinatController@UpdateFormMinatMain_new');
        Route::post('UpdateFormMinatFarmers_new', 'Api\FormMinatController@UpdateFormMinatFarmers_new');
        Route::post('UpdateVerificationFormMinat_new', 'Api\FormMinatController@UpdateVerificationFormMinat_new');
    
        Route::post('DeleteFormMinatMain_new', 'Api\FormMinatController@DeleteFormMinatMain_new');
        Route::post('DeleteFormMinatFarmer_new', 'Api\FormMinatController@DeleteFormMinatFarmer_new');
    // SOSIALISASI TANAM
        Route::get('GetSostamAll_new', 'Api\SosialisasiTanamController@GetSostamAll_new');
        Route::get('GetDetailSostam_new', 'Api\SosialisasiTanamController@GetDetailSostam_new');
        
        Route::get('new-sostam/list/distribution-calendar', 'Api\DistributionController@DistributionCalendar_new');
        
        Route::post('new-sostam/create/new-data', 'Api\SosialisasiTanamController@AddSosialisasiTanam_new');
        
    // FARMER TRAINING
        Route::get('GetFarmerTrainingAll_new', 'Api\FarmerTrainingController@GetFarmerTrainingAll_new');
    // NEW MASTER DATA
    //FF
        Route::get('GetFFAllWeb_new', 'Api\FieldFacilitatorController@GetFFAllWeb_new');
        Route::get('GetDetailFFWeb_new', 'Api\FieldFacilitatorController@GetDetailFFWeb_new');
        Route::post('AddFF_new', 'Api\FieldFacilitatorController@AddFF_new');
        Route::post('createUpdateFFUserData', 'Api\FieldFacilitatorController@createUpdateFFUserData');
        Route::post('UpdateDataFF_new', 'Api\FieldFacilitatorController@UpdateDataFF_new');
        Route::post('HardDeleteFF_new', 'Api\FieldFacilitatorController@HardDeleteFF_new');
        Route::post('DeleteAssignData', 'Api\FieldFacilitatorController@DeleteAssignData');
    //Farmer
        Route::get('testFarmerGetAPI', 'Api\FarmerController@testFarmerGetAPI');
        
        
        Route::get('GetFarmerAllAdmin_new', 'Api\FarmerController@GetFarmerAllAdmin_new');
        Route::get('GetFarmerMobile', 'Api\FarmerController@GetFarmerMobile');
        Route::get('GetDetailFarmer_new', 'Api\FarmerController@GetDetailFarmer_new');
        Route::post('AddMandatoryFarmer_new', 'Api\FarmerController@AddMandatoryFarmer_new');
        Route::post('UpdateFarmerPivot_new', 'Api\FarmerController@UpdateFarmerPivot_new');
        Route::post('updateFarmerApproval', 'Api\FarmerController@updateFarmerApproval');
        Route::post('DeleteFarmerData_new', 'Api\FarmerController@DeleteFarmerData_new');
        Route::post('deleteFarmerPivot_new', 'Api\FarmerController@deleteFarmerPivot_new');
        Route::post('AssignAnotherFFtoFarmer_new', 'Api\FarmerController@AssignAnotherFFtoFarmer_new');
        Route::post('deleteFarmerworkingArea_new', 'Api\FarmerController@deleteFarmerworkingArea_new');
        Route::post('UnassignFarmerPivot_new', 'Api\FarmerController@UnassignFarmerPivot_new');
        Route::post('UpdateMainPivotProgramYear_new', 'Api\FarmerController@UpdateMainPivotProgramYear_new');
    //Lahan
        Route::get('GetLahanAll_new', 'Api\LahanController@GetLahanAll_new');
        Route::get('GetLahanByLahan_no_new', 'Api\LahanController@GetLahanByLahan_no_new');
        Route::get('lahans-by-lahan-no', 'Api\LahanController@GetLahansByLahanNo_new');
        Route::get('getDetailLahan_new', 'Api\LahanController@getDetailLahan_new');
        Route::get('getLahanTermAnswer_new', 'Api\LahanController@getLahanTermAnswer_new');
        Route::get('getExportDataLahanFarmer_new', 'Api\LahanController@getExportDataLahanFarmer_new');
    
        Route::post('UpdateLahanApproval_new', 'Api\LahanController@UpdateLahanApproval_new');
        
        Route::post('update-lahan/polygon-tutupan', 'Api\LahanController@UpdateLahanPolygonTutupan');
        Route::post('update-lahan/legal-eligibility', 'Api\LahanController@UpdateLahanLegalEligibility');
    
        Route::post('addLahanTermAnswer_new', 'Api\LahanController@addLahanTermAnswer_new');
        Route::post('UpdateLahanByGIS_new', 'Api\LahanController@UpdateLahanByGIS_new');
        Route::post('UpdateLahanSoilType_new', 'Api\LahanController@UpdateLahanSoilType_new');
        Route::post('UpdateSeedChanges_new', 'Api\LahanController@UpdateSeedChanges_new');
        Route::post('UpdateLahanEligibleStatus_new', 'Api\LahanController@UpdateLahanEligibleStatus_new');
        Route::post('UpdateLahanFCCompleteStatus_new', 'Api\LahanController@UpdateLahanFCCompleteStatus_new');
        Route::post('updateLahantermAnswer_new', 'Api\LahanController@updateLahantermAnswer_new');
        Route::post('DeleteDataLahan_new', 'Api\LahanController@DeleteDataLahan_new');
        Route::post('UpdateSeedAmountVerification_new', 'Api\LahanController@UpdateSeedAmountVerification_new');
        Route::post('UpdateReusableLahan_new', 'Api\LahanController@UpdateReusableLahan_new');
        Route::post('updateGISPlantingArea', 'Api\LahanController@updateGISPlantingArea');
        Route::post('UpdateLandMOUStatus_new', 'Api\LahanController@UpdateLandMOUStatus_new');
        
        Route::post('createFarmerLahanMOU_new', 'Api\LahanController@createFarmerLahanMOU_new');
        Route::post('updateFarmerLahanMOU_new', 'Api\LahanController@updateFarmerLahanMOU_new');
        Route::post('deleteFarmerLahanMOU_new', 'Api\LahanController@deleteFarmerLahanMOU_new');
        Route::post('farmer-mou/print', 'Api\LahanController@farmerMouPrint');
        Route::post('farmer-mou/print-appendix', 'Api\LahanController@farmerMouPrintAppendix');
        Route::post('farmer-mou/update', 'Api\LahanController@farmerMouUpdate');
        Route::post('farmer-mou/approve', 'Api\LahanController@farmerMouApprove');
        Route::get('farmer-mou/find', 'Api\LahanController@farmerMouFind');
        
        Route::get('lahan-export/social-impact-officer', 'Api\LahanController@getExportDataLahanFarmerSocialImpact_new');
        Route::get('lahan-export/for-report-data', 'Api\LahanController@getExportDataLahanFarmerWithDetailReport_new');
        
        Route::get('lahan_dev/test', 'Api\LahanController@LahansTestAPI');
        
        // Lahan Assestment
        Route::post('AddLahanAssestment', 'Api\LahanAssestmentController@AddLahanAssestment');
        Route::post('UpdateLahanAssestment', 'Api\LahanAssestmentController@UpdateLahanAssestment');
        Route::get('GetDetailLahanAssestment', 'Api\LahanAssestmentController@GetDetailLahanAssestment');
        
    // NEW UTILITIES
    // Employees
    Route::get('getEmployeeList_new', 'Api\EmployeeController@getEmployeeList_new');
    Route::get('getEmployeeTaskRole_new', 'Api\EmployeeController@getEmployeeTaskRole_new');
    Route::post('deleteEmployeeData_new', 'Api\EmployeeController@deleteEmployeeData_new');
    Route::post('addEmployeePosition_new', 'Api\EmployeeController@addEmployeePosition_new');
    
    //areas
    
    Route::get('GetDesaByKecamatanTA_new', 'Api\UtilitiesController@GetDesaByKecamatanTA_new');
    //kemandagri
    Route::get('new-utilities/desas', 'Api\UtilitiesController@GetDesaDynamicly');
    Route::get('new-utilities/kecamatans', 'Api\UtilitiesController@GetKecamatanDynamicly');
    Route::get('new-utilities/kabupatens', 'Api\UtilitiesController@GetKabupatenDynamicly');
    Route::get('new-utilities/provinces', 'Api\UtilitiesController@GetProvincesDynamicly');
    //T4T area management system
    Route::get('new-utilities/target-areas', 'Api\UtilitiesController@GetTargetAreaDynamicly');
    Route::get('new-utilities/management-units', 'Api\UtilitiesController@GetManagementUnitDynamicly');
    
    // TA
    Route::get('GetTA_new', 'Api\UtilitiesController@GetTA_new');
    
    //Trees
    Route::post('AddTreeModels', 'Api\TreesController@AddTreeModels');
    Route::get('GetTreeModels', 'Api\TreesController@GetTreeModels');
    Route::post('DeleteTreeModels', 'Api\TreesController@DeleteTreeModels');
    
    // Report
    Route::get('ControllerTestAPI', 'UserController@ControllerTestAPI');
    Route::get('getImageRouteForDev', 'UserController@getImageRouteForDev');
    Route::get('EmailToYongs', 'Api\TemporaryController@EmailtoExporter');
    
    // new dashboard
    Route::get('new-dashboard/land-by-purpose', 'Api\DashboardController@CountLandByProjectPurpose');
    Route::get('new-dashboard/farmers', 'Api\DashboardController@CountFarmers');
    Route::get('new-dashboard/ff', 'Api\DashboardController@CountFieldFacilitators');
});
