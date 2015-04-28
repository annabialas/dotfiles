// For use with: https://github.com/jasonm23/phoenix

var mash = ["cmd", "ctrl"];
var mashShift = ["cmd", "shift"];

var MARGIN_X = 5;
var MARGIN_Y = 5;
var GRID_WIDTH = 3;

Window.prototype.getGrid = function() {
  var winFrame = this.frame();
  var screenRect = this.screen().frameWithoutDockOrMenu();
  var thirdScreenWidth = screenRect.width / GRID_WIDTH;
  var halfScreenHeight = screenRect.height / 2;
  return {
    x: Math.round((winFrame.x - screenRect.x) / thirdScreenWidth),
    y: Math.round((winFrame.y - screenRect.y) / halfScreenHeight),
    w: Math.max(1, Math.round(winFrame.width / thirdScreenWidth)),
    h: Math.max(1, Math.round(winFrame.height / halfScreenHeight))
  };
};

Window.prototype.setGrid = function(grid, screen) {
  var screenRect = screen.frameWithoutDockOrMenu();
  var thirdScreenWidth = screenRect.width / GRID_WIDTH;
  var halfScreenHeight = screenRect.height / 2;
  var newFrame = {
    x: (grid.x * thirdScreenWidth) + screenRect.x,
    y: (grid.y * halfScreenHeight) + screenRect.y,
    width: grid.w * thirdScreenWidth,
    height: grid.h * halfScreenHeight
  };

  newFrame.x += MARGIN_X;
  newFrame.y += MARGIN_Y;
  newFrame.width -= (MARGIN_X * 2.0);
  newFrame.height -= (MARGIN_Y * 2.0);

  this.setFrame(newFrame);
}

Window.prototype.snapToGrid = function() {
  if (this.isNormalWindow()) {
    this.setGrid(this.getGrid(), this.screen());
  }
}

function changeGridWidth(by) {
  GRID_WIDTH = Math.max(1, GRID_WIDTH + by);
  api.alert("grid is now " + GRID_WIDTH + " tiles wide", 1);
  _.each(Window.visibleWindows(), function(win) { win.snapToGrid(); });
}

api.bind(';', mash, function() { Window.focusedWindow().snapToGrid(); });
api.bind("'", mash, function() { _.each(Window.visibleWindows(), function(win) { win.snapToGrid(); }); });

api.bind('=', mash, function() { changeGridWidth(+1); });
api.bind('-', mash, function() { changeGridWidth(-1); });

api.bind('H', mashShift, function() { Window.focusedWindow().focusWindowLeft(); });
api.bind('L', mashShift, function() { Window.focusedWindow().focusWindowRight(); });
api.bind('K', mashShift, function() { Window.focusedWindow().focusWindowUp(); });
api.bind('J', mashShift, function() { Window.focusedWindow().focusWindowDown(); });

api.bind('M', mash, function() {
  var win = Window.focusedWindow();
  var f = {x: 0, y: 0, w: GRID_WIDTH, h: 2};
  win.setGrid(f, win.screen());
  return true;
});

api.bind('N', mash, function() {
  var win = Window.focusedWindow();
  win.setGrid(win.getGrid(), win.screen().nextScreen());
  return true;
});

api.bind('P', mash, function() {
  var win = Window.focusedWindow();
  win.setGrid(win.getGrid(), win.screen().previousScreen());
  return true;
});



api.bind('H', mash, function() {
  var win = Window.focusedWindow();
  var f = win.getGrid();
  f.x = Math.max(f.x - 1, 0);
  win.setGrid(f, win.screen());
  return true;
});

api.bind('L', mash, function() {
  var win = Window.focusedWindow();
  var f = win.getGrid();
  f.x = Math.min(f.x + 1, GRID_WIDTH - f.w);
  win.setGrid(f, win.screen());
  return true;
});

api.bind('O', mash, function() {
  var win = Window.focusedWindow();
  var f = win.getGrid();
  f.w = Math.min(f.w + 1, GRID_WIDTH - f.x);
  win.setGrid(f, win.screen());
  return true;
});

api.bind('I', mash, function() {
  var win = Window.focusedWindow();
  var f = win.getGrid();
  f.w = Math.max(f.w - 1, 1);
  win.setGrid(f, win.screen());
  return true;
});

api.bind('J', mash, function() {
  var win = Window.focusedWindow();
  var f = win.getGrid();
  f.y = 1;
  f.h = 1;
  win.setGrid(f, win.screen());
  return true;
});

api.bind('K', mash, function() {
  var win = Window.focusedWindow();
  var f = win.getGrid();
  f.y = 0;
  f.h = 1;
  win.setGrid(f, win.screen());
  return true;
});

api.bind('U', mash, function() {
  var win = Window.focusedWindow();
  var f = win.getGrid();
  f.y = 0;
  f.h = 2;
  win.setGrid(f, win.screen());
  return true;
});
