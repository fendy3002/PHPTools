<?php
namespace Tests\Manual;
use QzPhp\Q;

class Db extends \TestCase
{
    public function test(){
        $db = $this->generateDb();
        $string = '';
        for($i = 0; $i < 1024 * 1024 * 10; $i++){
            $string .= 'a';
        }
        $result = $db->select("select :name as `name`;", [
            "name" => $string
        ]);

        print_r($result);
    }

    private function generateDb(){
        $dsn = 'mysql:dbname=' . 'test' . ';port=3307; host=' . '127.0.0.1';
        $dbh = new \PDO($dsn, 'root', 'password');
        $dbh->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);

        $db = new \Illuminate\Database\Connection($dbh, 'test');
        $grammar = new \Illuminate\Database\Query\Grammars\MySqlGrammar();
        $db->setQueryGrammar($grammar);

        return $db;
    }
}
