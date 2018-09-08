<?php
require_once('lib/vendor/autoload.php');

use kow08absty\db\Database;
use kow08absty\Util;

/**
 * *** implemented WebIF query statements ***
 *
 * UUIDがカラム uuid に存在するかチェック -> bool string ('true' if exists, otherwise 'false')
 * (POST) database.php?q=is_exists&uuidv4=[UUID]
 *
 * 使われていない新しいUUIDを生成 -> string
 * (POST) database.php?q=create_uuid
 *
 * アイコン、シートをすべて取得 -> JSON encoded string { 'title': [title], 'icon': [base64], 'sheet': [JSON sheet data] }
 * (POST) database.php?q=fetch_data&uuidv4=[UUID]
 *
 * キャラクターデータ編集開始 -> string (token)
 * (POST) database.php?q=get_edit_token&uuidv4=[UUID]
 *
 * キャラクターデータを更新 -> string ({UUIDv4} if new item was inserted, 'OK' if updated, otherwise 'Fail')
 * (POST) database.php?q=save_data&uuidv4=[UUID]&title=[title]&token=[EditingToken]&sheet=[sheet]&icon=[icon]&ignore_token=TRUE or FALSE
 *
 * キャラクターデータ削除 -> string ('OK' if succeeded, otherwise 'Fail')
 * (POST) database.php?q=remove_sheet&uuidv4=[UUID]
 *
 */


/**
 * @var const PDOコンストラクタに渡す接続用文字列
 */
const SHEETS_DSN = 'sqlite:./res/kemoTrpgSheets.sqlite';
//SHEETS_DSN = 'mysql:dbname=kemoTrpgSheets;hostname=localhost';
/**
 * @var const PDOコンストラクタに渡すユーザー名（必要な場合）
 */
const DSN_USER = 'hoge';
/**
 * @var const PDOコンストラクタに渡すパスワード（必要な場合）
 */
const DSN_PASSWORD = 'fuga';
/**
 * @var const テーブル名
 */
const SHEETS_TABLE_NAME = 'charsheet';
/**
 * @var const カラム配列
 */
const SHEETS_COLUMNS = ['row_id', 'uuid', 'title', 'icon', 'sheet', 'editToken', 'password'];
/**
 * @var const カラム定義配列
 */
const SHEETS_COLUMN_SPECS = ['integer primary key', 'text not null', 'text', 'text', 'blob', 'text', 'text'];


// PDO Setup
$dbh = Database::instantiate(SHEETS_DSN, DSN_USER, DSN_PASSWORD);

assert($dbh !== null);

$dbh->createTableIfNotExists(SHEETS_TABLE_NAME, SHEETS_COLUMNS, SHEETS_COLUMN_SPECS);


// POST Request Analyze
if(isset($_POST['q'])){
    $key = false;
    if(isset($_POST['uuidv4']))
        $key = Util::isAvailableUuidV4($_POST['uuidv4']);
    switch($_POST['q']){
        case 'is_exists':
            echo ($dbh->isRowExists(SHEETS_TABLE_NAME, SHEETS_COLUMNS[1] . "='$key'")) ? 'true' : 'false';
            break;

        case 'create_uuid':
            echo createUuid();
            break;

        case 'fetch_data':
            $data = $dbh->select(SHEETS_TABLE_NAME, [SHEETS_COLUMNS[2], SHEETS_COLUMNS[3], SHEETS_COLUMNS[4]], SHEETS_COLUMNS[1] . "='$key'")->fetch(\PDO::FETCH_BOTH);
            echo json_encode([
                'title' => $data[0],
                'icon' => $data[1],
                'sheet' => $data[2]
            ]);
            break;

        case 'get_edit_token':
            echo $dbh->select(SHEETS_TABLE_NAME, [SHEETS_COLUMNS[5]], SHEETS_COLUMNS[1] . "='$key'")->fetch(\PDO::FETCH_BOTH)[0];
            break;

        case 'save_data':
            $new_key = $key;
            if(!$new_key)
                $new_key = createUuid();
            if(!$new_key)
                die('Fail');
            $data = [
                SHEETS_COLUMNS[1] => $new_key
            ];
            if(isset($_POST['title']))
                $data[SHEETS_COLUMNS[2]] = $_POST['title'];
            if(isset($_POST['icon']))
                $data[SHEETS_COLUMNS[3]] = $_POST['icon'];
            if(isset($_POST['sheet']))
                $data[SHEETS_COLUMNS[4]] = $_POST['sheet'];
            $dbh->insertOrUpdate(SHEETS_TABLE_NAME, $data, SHEETS_COLUMNS[1] . "='$new_key'");
            echo (!$key) ? $new_key : 'OK';
            break;

        case 'remove_sheet':
            $dbh->delete(SHEETS_TABLE_NAME, SHEETS_COLUMNS[1] . "='$key'");
            echo 'OK';
            break;
    }
}

$dbh->close();

function createUuid(){
    global $dbh;
    $uuidv4 = Util::genUuidV4();
    for($i=0; $i<300 && $dbh->isRowExists(SHEETS_TABLE_NAME, SHEETS_COLUMNS[1] . "='$uuidv4'"); $i++){
        $uuidv4 = Util::genUuidV4();
    }
    if($i === 300)
        return false;
    return $uuidv4;
}
