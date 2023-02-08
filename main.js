"use strict";
exports.__esModule = true;
// 型定義ファイルをインポート
var globalized_1 = require("node_modules/phina.js.d.ts/globalized");
globalized_1["default"].globalize();
// 定数
var SCREEN_WIDTH = 640; // 画面横サイズ
var SCREEN_HEIGHT = 960; // 画面縦サイズ
var PIECE_SIZE = SCREEN_WIDTH / 4; // グリッドのサイズ
var PIECE_NUM = 16; // ピース数
var PIECE_NUM_X = 4; // 横のピース数
var PIECE_OFFSET = PIECE_SIZE / 2; // オフセット値
// アセット
var ASSETS = {
    // 画像
    image: {
        'pieces': 'assets/pieces.png'
    }
};
// メインシーン
globalized_1["default"].define('MainScene', {
    superClass: 'DisplayScene',
    // コンストラクタ
    init: function () {
        // 親クラス初期化
        this.superInit();
        // 背景色
        this.backgroundColor = 'black';
        // グリッド
        this.grid = Grid(SCREEN_WIDTH, PIECE_NUM_X);
        // ピースグループ
        this.pieceGroup = DisplayElement().addChildTo(this);
        // ピース配置
        this.createPiece();
    },
    // ピース配置関数
    createPiece: function () {
        PIECE_NUM.times(function (i) {
            var _this = this;
            // グリッド配置用のインデックス値算出
            var sx = i % PIECE_NUM_X;
            var sy = Math.floor(i / PIECE_NUM_X);
            // 番号
            var num = i + 1;
            // ピース作成
            var piece = Piece(num).addChildTo(this.pieceGroup);
            // Gridを利用して配置
            piece.x = this.grid.span(sx) + PIECE_OFFSET;
            piece.y = this.grid.span(sy) + PIECE_OFFSET;
            // グリッド上のインデックス値
            piece.indexPos = Vector2(sx, sy);
            // タッチを有効にする
            piece.setInteractive(true);
            // タッチされた時の処理
            piece.on('pointend', function () {
                // ピース移動処理
                _this.movePiece(piece);
            });
            // 16番のピースは非表示
            if (num === 16) {
                piece.hide();
            }
        }, this);
    },
    // 16番ピース（空白）を取得
    getBlankPiece: function () {
        var result = null;
        this.pieceGroup.children.some(function (piece) {
            // 16番ピースを結果に格納I
            if (piece.num === 16) {
                result = piece;
                return true;
            }
        });
        return result;
    },
    // ピースの移動処理
    movePiece: function (piece) {
        // 空白ピースを得る
        var blank = this.getBlankPiece();
        // x, yの座標差の絶対値
        var dx = Math.abs(piece.indexPos.x - blank.indexPos.x);
        var dy = Math.abs(piece.indexPos.y - blank.indexPos.y);
        // 隣り合わせの判定
        if ((piece.indexPos.x === blank.indexPos.x && dy === 1) ||
            (piece.indexPos.y === blank.indexPos.y && dx === 1)) {
            // タッチされたピース位置を記憶
            var tPos_1 = Vector2(piece.x, piece.y);
            // ピース移動処理
            piece.tweener
                .to({ x: blank.x, y: blank.y }, 100)
                .call(function () {
                blank.setPosition(tPos_1.x, tPos_1.y);
                piece.indexPos = this.coordToIndex(piece.position);
                blank.indexPos = this.coordToIndex(blank.position);
            }, this)
                .play();
        }
    },
    // 座標値からインデックス値へ変換
    coordToIndex: function (vec) {
        var x = Math.floor(vec.x / PIECE_SIZE);
        var y = Math.floor(vec.y / PIECE_SIZE);
        return Vector2(x, y);
    }
});
// ピースクラス
globalized_1["default"].define('Piece', {
    // Spriteを継承
    superClass: 'Sprite',
    // コンストラクタ
    init: function (num) {
        // 親クラス初期化
        this.superInit('pieces', PIECE_SIZE, PIECE_SIZE);
        // 数字
        this.num = num;
        // フレーム
        this.frameIndex = this.num - 1;
        // 位置インデックス
        this.indexPos = Vector2.ZERO;
    }
});
// メイン
globalized_1["default"].main(function () {
    var app = GameApp({
        startLabel: 'main',
        // アセット読み込み
        assets: ASSETS
    });
    app.run();
});
