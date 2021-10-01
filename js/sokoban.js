'use strict';

var floor = 'floor';
var wall = 'wall';
var target = 'target';
var box = '📦';
var gamer = '👲';
var clock = '⏰';
var magnet = '🧲';
var gold = '💯';
var glue = '🍭';
var water = '💦';

var gBoard;
var gGamerPos;
var gScore = 0;
var gStepsCount = 0;
var gTargets = 6;
var gClock = {
    isClock: false,
    unCountSteps: 10
}
var gIsMagnet = false;
var gIsGlued = false;
var gisGameOn = false;
var addBonuses;
var elModal = document.querySelector('.modal')
var isMyBoard = false;
var gCreatedBoard;
var gGameMoves = [];
var gboardSet;

function play() {
    isMyBoard = false;
    init();
}

function init() {
    clearInterval(addBonuses);
    elModal.style.display = 'none';
    document.querySelector('.create').style.display = 'none';
    gScore = 0;
    updateScore(0)
    gStepsCount = 0;
    updateSteps(0)
    gGamerPos = { i: 5, j: 3 };
    if (isMyBoard) {
        gBoard = gCreatedBoard;
        isMyBoard = false;
    } else gBoard = createBoard();
    renderBoard(gBoard);
    getObstacles(2);
    gboardSet = boardSet(gBoard);
    gisGameOn = true;
    gGameMoves = [];
    addedWallsCount = 6;
    addedboxsCount = 6;
    addedtargetsCount = 6;
    addBonuses = setInterval(getBonus, 10000);
}

function boardSet(board) {
    var mat = createMat(10, 10)
    for (var i = 0; i < mat.length; i++) {
        for (var j = 0; j < mat[0].length; j++) {
            var cell = { type: board[i][j].type, gameElement: board[i][j].gameElement };
            mat[i][j] = cell;
        }
    }
    return mat;
}

function createBoard() {
    var board = createMat(10, 10)

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            // Put Floor 
            var cell = { type: floor, gameElement: null };
            // Place Walls
            if (i === 0 || i === board.length - 1 || j === 0 || j === board[0].length - 1 || j === 4 && i < 4) {
                cell.type = wall;
            }
            //place targets
            if (i === 1 && j === 1 || i === 1 && j === board.length - 2 || i === board.length - 2 && j === 1
                || i === board.length - 2 && j === board.length - 2 || i === board.length - 4 && j === board.length - 4 || i === 4 && j === 4) {
                cell.type = target;
            }
            board[i][j] = cell;
        }
    }
    // Place the gamer
    board[gGamerPos.i][gGamerPos.j].gameElement = gamer;

    // Place the boxes
    board[7][7].gameElement = box;
    board[5][5].gameElement = box;
    board[3][2].gameElement = box;
    board[4][board.length - 2].gameElement = box;
    board[6][1].gameElement = box;
    board[8][3].gameElement = box;

    // place the glue & the water
    board[7][3].gameElement = glue;
    board[6][5].gameElement = water;

    return board;
}

function createMyBoard() {
    clearInterval(addBonuses);
    document.querySelector('.create').style.display = 'block';
    isMyBoard = true;
    gisGameOn = false;
    var board = createMat(10, 10)

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = { type: floor, gameElement: null };

            if (i === 0 || i === board.length - 1 || j === 0 || j === board[0].length - 1) {
                cell.type = wall;
            }
            board[i][j] = cell;
        }
    }
    gGamerPos = { i: 5, j: 3 };
    board[gGamerPos.i][gGamerPos.j].gameElement = gamer;
    console.log(board);
    gCreatedBoard = board;
    renderBoard(gCreatedBoard)

}

function renderBoard(board) {

    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j];

            var cellClass = getClassName({ i: i, j: j })

            if (currCell.type === floor) cellClass += ' floor';
            else if (currCell.type === wall) cellClass += ' wall';
            else if (currCell.type === target) cellClass += ' target'
            if (isMyBoard) {
                strHTML += '\t<td class="cell ' + cellClass +
                    '"  onclick="addObject(' + i + ',' + j + ')" >\n';
            } else {
                strHTML += '\t<td class="cell ' + cellClass +
                    '"  onclick="moveTo(' + i + ',' + j + ')" >\n';
            }

            switch (currCell.gameElement) {
                case gamer:
                    strHTML += gamer;
                    break;
                case box:
                    strHTML += box;
                    break;
                case glue:
                    strHTML += glue;
                    break;
                case water:
                    strHTML += water;
                    break;
            }

            strHTML += '\t</td>\n';
        }
        strHTML += '</tr>\n';
    }

    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}

function reset() {
    if(!gisGameOn) return;
    gBoard = gboardSet;
    gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
    gGamerPos = { i: 5, j: 3 };
    gBoard[gGamerPos.i][gGamerPos.j].gameElement = gamer;
    renderBoard(gBoard)
    if (gScore > 20) updateScore(-20);
    gboardSet = boardSet(gBoard);
}

var addedWallsCount = 6;
var addedboxsCount = 6;
var addedtargetsCount = 6;

function addObject(i, j) {
    if (i === 5 && j === 3) return;
    var elInstraction = document.querySelector('h3');
    var currvalue;

    if (addedWallsCount > 0) {
        elInstraction.innerText = '🧱  Add 6 wall cells  🧱';
        currvalue = wall;
        gCreatedBoard[i][j].type = wall;
        addedWallsCount--;
    } else if (addedtargetsCount > 0) {
        elInstraction.innerText = '🎯  Add 6 Target Cells  🎯';
        currvalue = target;
        gCreatedBoard[i][j].type = target;
        addedtargetsCount--;
    } else if (addedboxsCount > 0) {
        elInstraction.innerText = '📦  Add 6 Box Cells  📦';
        currvalue = box;
        gCreatedBoard[i][j].gameElement = box;
        addedboxsCount--;
    }

    if (addedboxsCount === 0) {
        elInstraction.innerText = '✨  Press Start To Play  ✨';
        document.querySelector('.btnStart').style.display = 'block';
    }
    renderBoard(gCreatedBoard);
}

function moveTo(i, j) {
    if (!gisGameOn) return;
    if (gIsGlued) return;
    var targetCell = gBoard[i][j];
    if (targetCell.type === wall) return;

    var iAbsDiff = Math.abs(i - gGamerPos.i);
    var jAbsDiff = Math.abs(j - gGamerPos.j);
    var iDiff = i - gGamerPos.i;
    var jDiff = j - gGamerPos.j;

    saveMove(gBoard);

    if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0)) {
        if (targetCell.gameElement === box) {
            var isBoxMoveable = moveBox(i, j, iDiff, jDiff);
            if (!isBoxMoveable) return;
        } else if (targetCell.gameElement === water) {
            return;
        } else if (targetCell.gameElement === gold) {
            updateScore(100);
        } else if (targetCell.gameElement === clock) {
            gClock.isClock = true;
        } else if (targetCell.gameElement === magnet) {
            gIsMagnet = true;
        } else if (targetCell.gameElement === glue) {
            gIsGlued = true;
            updateSteps(4);
            setTimeout(function () {
                gIsGlued = false;
            }, 5000);
        }
        // var elCell = document.querySelector('.'+ getClassName(gGamerPos));
        gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
        renderCell(gGamerPos, '');
        // elCell.style.border = 'none';
        gGamerPos.i = i;
        gGamerPos.j = j;
        gBoard[gGamerPos.i][gGamerPos.j].gameElement = gamer;
        renderCell(gGamerPos, gamer);
        // elCell = document.querySelector('.'+ getClassName(gGamerPos))
        // var res = getClassName(gGamerPos)
        // console.log('res', res);

        // elCell.style.border = '4px solid red';
        if (!gClock.isClock) updateSteps(1);
        else {
            gClock.unCountSteps--;
            if (gClock.unCountSteps === 0) {
                gClock.isClock = false;
                gClock.unCountSteps = 10;
            }
        }
    }
}

function saveMove(board) {
    var mat = createMat(10, 10)
    for (var i = 0; i < mat.length; i++) {
        for (var j = 0; j < mat[0].length; j++) {
            var cell = { type: board[i][j].type, gameElement: board[i][j].gameElement };
            if (board[i][j].gameElement === gamer) var currPlayerPos = { i, j }
            mat[i][j] = cell;
        }
    }

    var currStatus = {
        board: mat,
        gamerPos: currPlayerPos,
        steps: gStepsCount,
        score: gScore,
    }
    gGameMoves.push(currStatus);
}

function undo() {
    if (!gisGameOn) return;

    var undoStep = gGameMoves.pop();
    gStepsCount = undoStep.steps;
    updateSteps(0);
    gScore = undoStep.score;
    updateScore(0);
    gGamerPos = undoStep.gamerPos;
    gBoard = undoStep.board;
    renderBoard(gBoard);
}

function moveBox(cellI, cellJ, iDiff, jDiff) {
    var NextIPos = cellI + iDiff;
    var NextJPos = cellJ + jDiff;
    var currBox = gBoard[cellI][cellJ];
    var currBoxPos = {
        i: cellI,
        j: cellJ
    }
    var nextBoxPos = {
        i: NextIPos,
        j: NextJPos
    }
    var nextBox = gBoard[nextBoxPos.i][nextBoxPos.j];

    if (nextBox.type === wall && gIsMagnet) {

        if (iDiff === 0 && jDiff === -1) {
            if (gBoard[gGamerPos.i][gGamerPos.j + 1].gameElement === box || gBoard[gGamerPos.i][gGamerPos.j + 1].type === wall) return false;
            gGamerPos.j += 1;
            nextBoxPos.j += 2;
        } else if (iDiff === 0 && jDiff === 1) {
            if (gBoard[gGamerPos.i][gGamerPos.j - 1].gameElement === box || gBoard[gGamerPos.i][gGamerPos.j - 1].type === wall) return false;
            gGamerPos.j -= 1;
            nextBoxPos.j -= 2;
        } else if (iDiff === -1 && jDiff === 0) {
            if (gBoard[gGamerPos.i + 1][gGamerPos.j].gameElement === box || gBoard[gGamerPos.i + 1][gGamerPos.j].type === wall) return false;
            gGamerPos.i += 1;
            nextBoxPos.i += 2;
        } else if (iDiff === 1 && jDiff === 0) {
            if (gBoard[gGamerPos.i - 1][gGamerPos.j].gameElement === box || gBoard[gGamerPos.i - 1][gGamerPos.j].type === wall) return false;
            gGamerPos.i -= 1;
            nextBoxPos.i -= 2;
        }

        gBoard[gGamerPos.i][gGamerPos.j].gameElement = gamer;

        renderCell(gGamerPos, gamer);
        gBoard[nextBoxPos.i][nextBoxPos.j].gameElement = box;
        renderCell(nextBoxPos, box);
        currBox.gameElement = null;
        currBoxPos.gameElement = null;
        renderCell(currBoxPos, '');
        gIsMagnet = false;
        return false

    } else if (nextBox.type === wall || nextBox.gameElement === box) return false;
    else if (nextBox.gameElement === water) {

        if (gBoard[gGamerPos.i + iDiff][gGamerPos.j + jDiff].gameElement === box && gBoard[nextBoxPos.i + iDiff][nextBoxPos.j + jDiff].gameElement === box) {
            return false;
        }

        gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
        renderCell(gGamerPos, '');
        gGamerPos.i += iDiff;
        gGamerPos.j += jDiff;
        updateSteps(1)

        if (gBoard[nextBoxPos.i + iDiff][nextBoxPos.j + jDiff].type === wall) {
            gBoard[nextBoxPos.i][nextBoxPos.j].gameElement = box
            renderCell(nextBoxPos, box);
            gBoard[gGamerPos.i][gGamerPos.j].gameElement = gamer;
            renderCell(gGamerPos, gamer);
            return false;
        }

        while (gBoard[nextBoxPos.i + iDiff][nextBoxPos.j + jDiff].type === floor && gBoard[nextBoxPos.i + iDiff][nextBoxPos.j + jDiff].gameElement !== box ||
            gBoard[nextBoxPos.i + iDiff][nextBoxPos.j + jDiff].type === target && gBoard[nextBoxPos.i + iDiff][nextBoxPos.j + jDiff].gameElement !== box) {

            nextBoxPos.i += iDiff;
            nextBoxPos.j += jDiff;
            gBoard[nextBoxPos.i][nextBoxPos.j].gameElement = box;
            renderCell(nextBoxPos, box);

            gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
            renderCell(gGamerPos, '');

            gGamerPos.i += iDiff;
            gGamerPos.j += jDiff;
            gBoard[gGamerPos.i][gGamerPos.j].gameElement = gamer;
            renderCell(gGamerPos, gamer);

            updateSteps(1)
        }
        return false;

    } else {
        currBox.gameElement = null;
        nextBox.gameElement = box;
        renderCell(nextBoxPos, box);
    }

    if (nextBox.type === target) {
        updateScore(10);
        checkGameOver();
    }

    return true;
}

function checkGameOver() {
    var count = 0;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].gameElement === box && gBoard[i][j].type === target) count++
        }
    }
    if (gTargets === count) {
        elModal.style.display = 'block';
        clearInterval(addBonuses);
        gisGameOn = false;
    }
}

function getBonus() {
    var gameElements = [clock, magnet, gold];
    var randIdx = getRandomInt(0, gameElements.length)
    var elemnt = gameElements[randIdx];
    var randCell = getEmpthyCell(gBoard);
    gBoard[randCell.i][randCell.j].gameElement = elemnt;
    renderCell(randCell, elemnt);

    setTimeout(function () {
        if (gBoard[randCell.i][randCell.j].gameElement === elemnt) {
            gBoard[randCell.i][randCell.j].gameElement = null;
            renderCell(randCell, '');
        }

    }, 5000);
}

function getObstacles(num) {
    for (var i = 0; i < num; i++) {
        var randGlueCell = getEmpthyCell(gBoard);
        gBoard[randGlueCell.i][randGlueCell.j].gameElement = glue;
        renderCell(randGlueCell, glue);

        var randWaterCell = getEmpthyCell(gBoard);
        gBoard[randWaterCell.i][randWaterCell.j].gameElement = water;
        renderCell(randWaterCell, water);
    }
}

function updateScore(diff) {
    gScore += diff;
    document.querySelector('h2 span').innerText = gScore;
}

function updateSteps(diff) {
    gStepsCount += diff;
    document.querySelector('.steps').innerText = gStepsCount;
}

function getEmpthyCell(board) {
    var empthyCells = [];
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var currCell = board[i][j];
            var currCellPos = { i, j };
            if (!currCell.gameElement && currCell.type === floor) empthyCells.push(currCellPos)
        }
    }
    var randCell = drawNum(empthyCells)
    return randCell
}

function renderCell(location, value) {
    var cellSelector = '.' + getClassName(location)
    var elCell = document.querySelector(cellSelector);
    elCell.innerHTML = value;
}

function handleKey(event) {
    var i = gGamerPos.i;
    var j = gGamerPos.j;

    switch (event.key) {
        case 'ArrowLeft':
            moveTo(i, j - 1);
            break;
        case 'ArrowRight':
            moveTo(i, j + 1);
            break;
        case 'ArrowUp':
            moveTo(i - 1, j);
            break;
        case 'ArrowDown':
            moveTo(i + 1, j);
            break;
    }
}

function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j;
    return cellClass;
}

