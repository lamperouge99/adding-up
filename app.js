'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ input: rs, output: {} });
const prefectureDataMap = new Map(); // key: 都道府県 value: 集計データのオブジェクト
rl.on('line', lineString => {
  const columns = lineString.split(','); //["集計年","都道府県名","10〜14歳の人口","15〜19歳の人口"]の配列に分割
  const year = parseInt(columns[0]);　//yearに集計年を代入
  const prefecture = columns[1];　　　//prefectureに都道府県名を代入
  const popu = parseInt(columns[3]);　　//popuに15~19歳の人口を代入
  if (year === 2010 || year === 2015) {
    let value = prefectureDataMap.get(prefecture); //連想配列に収納されていれば保存されているオブジェクトが取得される
    if (!value) {   //連想配列に収納されていなければこれを実行
      value = {      //valueというオブジェクトを定義？　連想配列における値でもある？
        popu10: 0,   //2010年の人口のプロパティ　popu10を定義？
        popu15: 0,   //2015年の人口のプロパティ　popu15を定義？
        change: null　　//変化率のプロパティ　changeを定義？
      };
    }
    if (year === 2010) {
      value.popu10 = popu;　　//11行目でpopuに代入された値をvalueオブジェクトのpopu10プロパティに格納
    }
    if (year === 2015) {
      value.popu15 = popu;　　//11行目でpopuに代入された値をvalueオブジェクトのpopu15プロパティに格納
    }
    prefectureDataMap.set(prefecture, value);　 //連想配列の値がvalueというオブジェクトになっている。　なぜこれがこんなに下にあるのかわからない
  }
});
rl.on('close', () => {
    for (let [key, value] of prefectureDataMap) {
        value.change = value.popu15 / value.popu10;
      }
    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
        return pair2[1].change - pair1[1].change;
    });
      const rankingStrings = rankingArray.map(([key, value]) => {
        return (
          key +
          ': ' +
          value.popu10 +
          '=>' +
          value.popu15 +
          ' 変化率:' +
          value.change
    　);
    });
    console.log(rankingStrings);
});