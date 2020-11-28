import { GridStack } from '../src/gridstack';
import { GridStackDD } from '../src/gridstack-dd'; // html5 vs Jquery set when including all file above
import { Utils } from '../src/utils';

describe('gridstack', function() {
  'use strict';

  // grid has 4x2 and 4x4 top-left aligned - used on most test cases
  let gridHTML =
  '<div class="grid-stack">' +
  '  <div class="grid-stack-item" data-gs-x="0" data-gs-y="0" data-gs-width="4" data-gs-height="2" data-gs-id="gsItem1" id="item1">' +
  '    <div class="grid-stack-item-content">item 1 text</div>' +
  '  </div>' +
  '  <div class="grid-stack-item" data-gs-x="4" data-gs-y="0" data-gs-width="4" data-gs-height="4" data-gs-id="gsItem2" id="item2">' +
  '    <div class="grid-stack-item-content">item 2 text</div>' +
  '  </div>' +
  '</div>';
  let gridstackHTML =
  '<div style="width: 800px; height: 600px" id="gs-cont">' + gridHTML + '</div>';
  let gridstackSmallHTML =
  '<div style="width: 400px; height: 600px" id="gs-cont">' + gridHTML + '</div>';
  // empty grid
  let gridstackEmptyHTML =
  '<div style="width: 800px; height: 600px" id="gs-cont">' +
  '  <div class="grid-stack">' +
  '  </div>' +
  '</div>';
  // nested empty grids
  let gridstackNestedHTML =
  '<div style="width: 800px; height: 600px" id="gs-cont">' +
  '  <div class="grid-stack">' +
  '    <div class="grid-stack-item">' +
  '      <div class="grid-stack-item-content">item 1</div>' +
  '      <div class="grid-stack-item-content">' +
  '         <div class="grid-stack sub1"></div>' +
  '      </div>' +
  '    </div>' +
  '  </div>' +
  '</div>';
  // generic widget with no param
  let widgetHTML = '<div id="item3"><div class="grid-stack-item-content"> hello </div></div>';

  describe('grid.init() / initAll()', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('use selector', function() {
      let grid = GridStack.init(undefined, '.grid-stack');
      expect(grid).not.toBe(null);
    });
    it('use selector no dot', function() {
      let grid = GridStack.init(null, 'grid-stack');
      expect(grid).not.toBe(null);
    });
    it('use wrong selector', function() {
      let grid = GridStack.init(null, 'FOO');
      expect(grid).toEqual(null);
    });
    it('initAll use selector', function() {
      let grids = GridStack.initAll(undefined, '.grid-stack');
      expect(grids.length).toBe(1);
    });
    it('initAll use selector no dot', function() {
      let grids = GridStack.initAll(undefined, 'grid-stack');
      expect(grids.length).toBe(1);
    });
    it('initAll use wrong selector', function() {
      let grids = GridStack.initAll(undefined, 'FOO');
      expect(grids.length).toBe(0);
    });
  });

  describe('grid.setAnimation', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should add class grid-stack-animate to the container.', function() {
      let grid = GridStack.init({animate: true});
      expect(grid.el.classList.contains('grid-stack-animate')).toBe(true);
      grid.el.classList.remove('grid-stack-animate');
      expect(grid.el.classList.contains('grid-stack-animate')).toBe(false);
      grid.setAnimation(true);
      expect(grid.el.classList.contains('grid-stack-animate')).toBe(true);
    });
    it('should remove class grid-stack-animate from the container.', function() {
      let grid = GridStack.init({animate: true});
      grid.setAnimation(false);
      expect(grid.el.classList.contains('grid-stack-animate')).toBe(false);
    });
  });

  describe('grid._setStaticClass', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should add class grid-stack-static to the container.', function() {
      let grid = GridStack.init({staticGrid: true});
      expect(grid.el.classList.contains('grid-stack-static')).toBe(true);
      grid.setStatic(false);
      expect(grid.el.classList.contains('grid-stack-static')).toBe(false);
      grid.setStatic(true);
      expect(grid.el.classList.contains('grid-stack-static')).toBe(true);
    });
    it('should remove class grid-stack-static from the container.', function() {
      let grid = GridStack.init({staticGrid: false});
      expect(grid.el.classList.contains('grid-stack-static')).toBe(false);
      grid.setStatic(true);
      expect(grid.el.classList.contains('grid-stack-static')).toBe(true);
    });
  });

  describe('grid.getCellFromPixel', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should return {x: 4, y: 5}.', function() {
      let cellHeight = 80;
      let rectMargin = 8; // ??? top/left margin of 8 when calling getBoundingClientRect 
      let options = {
        cellHeight: cellHeight,
        margin: 5
      };
      let grid = GridStack.init(options);
      let pixel = {left: 4 * 800 / 12 + rectMargin, top: 5 * cellHeight + rectMargin};
      let cell = grid.getCellFromPixel(pixel);
      expect(cell.x).toBe(4);
      expect(cell.y).toBe(5);
      cell = grid.getCellFromPixel(pixel, false);
      expect(cell.x).toBe(4);
      expect(cell.y).toBe(5);
      cell = grid.getCellFromPixel(pixel, true);
      expect(cell.x).toBe(4);
      expect(cell.y).toBe(5);
      pixel = {left: 4 * 800 / 12 + rectMargin, top: 5 * cellHeight + rectMargin};

      // now move 1 pixel in and get prev cell (we were on the edge)
      pixel.left--;
      pixel.top--;
      cell = grid.getCellFromPixel(pixel);
      expect(cell.x).toBe(3);
      expect(cell.y).toBe(4);
      cell = grid.getCellFromPixel(pixel, false);
      expect(cell.x).toBe(3);
      expect(cell.y).toBe(4);
      cell = grid.getCellFromPixel(pixel, true);
      expect(cell.x).toBe(3);
      expect(cell.y).toBe(4);
    });
  });

  describe('grid.cellWidth', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should return 1/12th of container width (not rounded anymore).', function() {
      let options = {
        cellHeight: 80,
        margin: 5,
        column: 12
      };
      let grid = GridStack.init(options);
      let res = grid.el.offsetWidth / 12;
      expect(grid.cellWidth()).toBe(res);
    });
    it('should return 1/10th of container width.', function() {
      let options = {
        cellHeight: 80,
        margin: 5,
        column: 10
      };
      let grid = GridStack.init(options);
      let res = Math.round(grid.el.offsetWidth / 10);
      expect(grid.cellWidth()).toBe(res);
    });
  });

  describe('grid.cellHeight', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should start at 80 then become 120', function() {
      let cellHeight = 80;
      let margin = 5;
      let options = {
        cellHeight: cellHeight,
        margin: margin,
        column: 12
      };
      let grid = GridStack.init(options);
      let rows = parseInt(grid.el.getAttribute('data-gs-current-row'));
      
      expect(grid.getRow()).toBe(rows);

      expect(grid.getCellHeight()).toBe(cellHeight);
      expect(parseInt(getComputedStyle(grid.el)['height'])).toBe(rows * cellHeight);

      grid.cellHeight( grid.getCellHeight() ); // should be no-op
      expect(grid.getCellHeight()).toBe(cellHeight);
      expect(parseInt(getComputedStyle(grid.el)['height'])).toBe(rows * cellHeight);

      cellHeight = 120; // should change and CSS actual height
      grid.cellHeight( cellHeight );
      expect(grid.getCellHeight()).toBe(cellHeight);
      expect(parseInt(getComputedStyle(grid.el)['height'])).toBe(rows * cellHeight);

      cellHeight = 20; // should change and CSS actual height
      grid.cellHeight( cellHeight );
      expect(grid.getCellHeight()).toBe(cellHeight);
      expect(parseInt(getComputedStyle(grid.el)['height'])).toBe(rows * cellHeight);
    });

    it('should be square', function() {
      let grid = GridStack.init({cellHeight: 'auto'});
      expect(grid.cellWidth()).toBe( grid.getCellHeight());
    });

  });

  describe('grid.column', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should have no changes', function() {
      let grid = GridStack.init();
      expect(grid.getColumn()).toBe(12);
      grid.column(12);
      expect(grid.getColumn()).toBe(12);
    }); 
    it('should SMALL change column number, no relayout', function() {
      let options = {
        column: 12
      };
      let grid = GridStack.init(options);
      let items = Utils.getElements('.grid-stack-item');
      grid.column(9);
      expect(grid.getColumn()).toBe(9);
      for (let j = 0; j < items.length; j++) {
        expect(parseInt(items[j].getAttribute('data-gs-y'), 10)).toBe(0);
      }
      grid.column(12);
      expect(grid.getColumn()).toBe(12);
      for (let j = 0; j < items.length; j++) {
        expect(parseInt(items[j].getAttribute('data-gs-y'), 10)).toBe(0);
      }
    });
    it('no sizing, no moving', function() {
      let grid = GridStack.init({column: 12});
      let items = Utils.getElements('.grid-stack-item');
      grid.column(8, 'none');
      expect(grid.getColumn()).toBe(8);
      for (let j = 0; j < items.length; j++) {
        expect(parseInt(items[j].getAttribute('data-gs-width'), 10)).toBe(4);
        expect(parseInt(items[j].getAttribute('data-gs-y'), 10)).toBe(0);
      }
    });
    it('no sizing, but moving down', function() {
      let grid = GridStack.init({column: 12});
      let items = Utils.getElements('.grid-stack-item');
      grid.column(7, 'none');
      expect(grid.getColumn()).toBe(7);
      for (let j = 0; j < items.length; j++) {
        expect(parseInt(items[j].getAttribute('data-gs-width'), 10)).toBe(4);
      }
      expect(parseInt(items[0].getAttribute('data-gs-y'), 10)).toBe(0);
      expect(parseInt(items[1].getAttribute('data-gs-y'), 10)).toBe(2);
    });
    it('should change column number and re-layout items', function() {
      let options = {
        column: 12,
        float: true
      };
      let grid = GridStack.init(options);
      let el1 = document.getElementById('item1')
      let el2 = document.getElementById('item2')

      // items start at 4x2 and 4x4
      expect(parseInt(el1.getAttribute('data-gs-x'))).toBe(0);
      expect(parseInt(el1.getAttribute('data-gs-y'))).toBe(0);
      expect(parseInt(el1.getAttribute('data-gs-width'))).toBe(4);
      expect(parseInt(el1.getAttribute('data-gs-height'))).toBe(2);

      expect(parseInt(el2.getAttribute('data-gs-x'))).toBe(4);
      expect(parseInt(el2.getAttribute('data-gs-y'))).toBe(0);
      expect(parseInt(el2.getAttribute('data-gs-width'))).toBe(4);
      expect(parseInt(el2.getAttribute('data-gs-height'))).toBe(4);
      // 1 column will have item1, item2
      grid.column(1);
      expect(grid.getColumn()).toBe(1);
      expect(parseInt(el1.getAttribute('data-gs-x'))).toBe(0);
      expect(parseInt(el1.getAttribute('data-gs-y'))).toBe(0);
      expect(parseInt(el1.getAttribute('data-gs-width'))).toBe(1);
      expect(parseInt(el1.getAttribute('data-gs-height'))).toBe(2);

      expect(parseInt(el2.getAttribute('data-gs-x'))).toBe(0);
      expect(parseInt(el2.getAttribute('data-gs-y'))).toBe(2);
      expect(parseInt(el2.getAttribute('data-gs-width'))).toBe(1);
      expect(parseInt(el2.getAttribute('data-gs-height'))).toBe(4);

      // add default 1x1 item to the end (1 column)
      let el3 = grid.addWidget();
      expect(el3).not.toBe(null);
      expect(parseInt(el3.getAttribute('data-gs-x'))).toBe(0);
      expect(parseInt(el3.getAttribute('data-gs-y'))).toBe(6);
      expect(parseInt(el3.getAttribute('data-gs-width'))).toBe(1);
      expect(parseInt(el3.getAttribute('data-gs-height'))).toBe(1);

      // back to 12 column and initial layout (other than new item3)
      grid.column(12);
      expect(grid.getColumn()).toBe(12);
      expect(parseInt(el1.getAttribute('data-gs-x'))).toBe(0);
      expect(parseInt(el1.getAttribute('data-gs-y'))).toBe(0);
      expect(parseInt(el1.getAttribute('data-gs-width'))).toBe(4);
      expect(parseInt(el1.getAttribute('data-gs-height'))).toBe(2);

      expect(parseInt(el2.getAttribute('data-gs-x'))).toBe(4);
      expect(parseInt(el2.getAttribute('data-gs-y'))).toBe(0);
      expect(parseInt(el2.getAttribute('data-gs-width'))).toBe(4);
      expect(parseInt(el2.getAttribute('data-gs-height'))).toBe(4);

      expect(parseInt(el3.getAttribute('data-gs-x'))).toBe(0);
      expect(parseInt(el3.getAttribute('data-gs-y'))).toBe(6); // ??? keep same row, but might more intuitive higher
      expect(parseInt(el3.getAttribute('data-gs-width'))).toBe(1); // ??? could take entire width if it did above
      expect(parseInt(el3.getAttribute('data-gs-height'))).toBe(1);

      // back to 1 column, move item2 to beginning to [3][1][2] vertically
      grid.column(1);
      expect(grid.getColumn()).toBe(1);
      grid.move(el3, 0, 0);
      expect(parseInt(el3.getAttribute('data-gs-x'))).toBe(0);
      expect(parseInt(el3.getAttribute('data-gs-y'))).toBe(0);
      expect(parseInt(el3.getAttribute('data-gs-width'))).toBe(1);
      expect(parseInt(el3.getAttribute('data-gs-height'))).toBe(1);

      expect(parseInt(el1.getAttribute('data-gs-x'))).toBe(0);
      expect(parseInt(el1.getAttribute('data-gs-y'))).toBe(1);
      expect(parseInt(el1.getAttribute('data-gs-width'))).toBe(1);
      expect(parseInt(el1.getAttribute('data-gs-height'))).toBe(2);

      expect(parseInt(el2.getAttribute('data-gs-x'))).toBe(0);
      expect(parseInt(el2.getAttribute('data-gs-y'))).toBe(3);
      expect(parseInt(el2.getAttribute('data-gs-width'))).toBe(1);
      expect(parseInt(el2.getAttribute('data-gs-height'))).toBe(4);

      // back to 12 column, el3 to be beginning still, but [1][2] to be in 1 columns still but wide 4x2 and 4x still
      grid.column(12);
      expect(grid.getColumn()).toBe(12);
      expect(parseInt(el3.getAttribute('data-gs-x'))).toBe(0);
      expect(parseInt(el3.getAttribute('data-gs-y'))).toBe(0);
      expect(parseInt(el3.getAttribute('data-gs-width'))).toBe(1);
      expect(parseInt(el3.getAttribute('data-gs-height'))).toBe(1);

      expect(parseInt(el1.getAttribute('data-gs-x'))).toBe(0);
      expect(parseInt(el1.getAttribute('data-gs-y'))).toBe(1);
      expect(parseInt(el1.getAttribute('data-gs-width'))).toBe(4);
      expect(parseInt(el1.getAttribute('data-gs-height'))).toBe(2);

      expect(parseInt(el2.getAttribute('data-gs-x'))).toBe(4);
      expect(parseInt(el2.getAttribute('data-gs-y'))).toBe(1);
      expect(parseInt(el2.getAttribute('data-gs-width'))).toBe(4);
      expect(parseInt(el2.getAttribute('data-gs-height'))).toBe(4);

      // 2 column will have item1, item2, item3 in 1 column still but half the width
      grid.column(1); // test convert from small, should use 12 layout still
      grid.column(2);
      expect(grid.getColumn()).toBe(2);

      expect(parseInt(el3.getAttribute('data-gs-x'))).toBe(0);
      expect(parseInt(el3.getAttribute('data-gs-y'))).toBe(0);
      expect(parseInt(el3.getAttribute('data-gs-width'))).toBe(1); // 1 as we scaled from 12 columns
      expect(parseInt(el3.getAttribute('data-gs-height'))).toBe(1);

      expect(parseInt(el1.getAttribute('data-gs-x'))).toBe(0);
      expect(parseInt(el1.getAttribute('data-gs-y'))).toBe(1);
      expect(parseInt(el1.getAttribute('data-gs-width'))).toBe(1);
      expect(parseInt(el1.getAttribute('data-gs-height'))).toBe(2);

      expect(parseInt(el2.getAttribute('data-gs-x'))).toBe(1);
      expect(parseInt(el2.getAttribute('data-gs-y'))).toBe(1);
      expect(parseInt(el2.getAttribute('data-gs-width'))).toBe(1);
      expect(parseInt(el2.getAttribute('data-gs-height'))).toBe(4);
    });
  });

  describe('oneColumnModeDomSort', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackEmptyHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should support default going to 1 column', function() {
      let options = {
        column: 12,
        float: true
      };
      let grid = GridStack.init(options);
      grid.batchUpdate();
      grid.batchUpdate();
      let el1 = grid.addWidget({width:1, height:1});
      let el2 = grid.addWidget({x:2, y:0, width:2, height:1});
      let el3 = grid.addWidget({x:1, y:0, width:1, height:2});
      grid.commit();
      grid.commit();
      
      // items are item1[1x1], item3[1x1], item2[2x1]
      expect(parseInt(el1.getAttribute('data-gs-x'))).toBe(0);
      expect(parseInt(el1.getAttribute('data-gs-y'))).toBe(0);
      expect(parseInt(el1.getAttribute('data-gs-width'))).toBe(1);
      expect(parseInt(el1.getAttribute('data-gs-height'))).toBe(1);

      expect(parseInt(el3.getAttribute('data-gs-x'))).toBe(1);
      expect(parseInt(el3.getAttribute('data-gs-y'))).toBe(0);
      expect(parseInt(el3.getAttribute('data-gs-width'))).toBe(1);
      expect(parseInt(el3.getAttribute('data-gs-height'))).toBe(2);

      expect(parseInt(el2.getAttribute('data-gs-x'))).toBe(2);
      expect(parseInt(el2.getAttribute('data-gs-y'))).toBe(0);
      expect(parseInt(el2.getAttribute('data-gs-width'))).toBe(2);
      expect(parseInt(el2.getAttribute('data-gs-height'))).toBe(1);

      // items are item1[1x1], item3[1x2], item2[1x1] in 1 column
      grid.column(1);
      expect(parseInt(el1.getAttribute('data-gs-x'))).toBe(0);
      expect(parseInt(el1.getAttribute('data-gs-y'))).toBe(0);
      expect(parseInt(el1.getAttribute('data-gs-width'))).toBe(1);
      expect(parseInt(el1.getAttribute('data-gs-height'))).toBe(1);

      expect(parseInt(el3.getAttribute('data-gs-x'))).toBe(0);
      expect(parseInt(el3.getAttribute('data-gs-y'))).toBe(1);
      expect(parseInt(el3.getAttribute('data-gs-width'))).toBe(1);
      expect(parseInt(el3.getAttribute('data-gs-height'))).toBe(2);

      expect(parseInt(el2.getAttribute('data-gs-x'))).toBe(0);
      expect(parseInt(el2.getAttribute('data-gs-y'))).toBe(3);
      expect(parseInt(el2.getAttribute('data-gs-width'))).toBe(1);
      expect(parseInt(el2.getAttribute('data-gs-height'))).toBe(1);
    });
    it('should support oneColumnModeDomSort ON going to 1 column', function() {
      let options = {
        column: 12,
        oneColumnModeDomSort: true,
        float: true
      };
      let grid = GridStack.init(options);
      let el1 = grid.addWidget({width:1, height:1});
      let el2 = grid.addWidget({x:2, y:0, width:2, height:1});
      let el3 = grid.addWidget({x:1, y:0, width:1, height:2});

      // items are item1[1x1], item3[1x1], item2[2x1]
      expect(parseInt(el1.getAttribute('data-gs-x'))).toBe(0);
      expect(parseInt(el1.getAttribute('data-gs-y'))).toBe(0);
      expect(parseInt(el1.getAttribute('data-gs-width'))).toBe(1);
      expect(parseInt(el1.getAttribute('data-gs-height'))).toBe(1);

      expect(parseInt(el3.getAttribute('data-gs-x'))).toBe(1);
      expect(parseInt(el3.getAttribute('data-gs-y'))).toBe(0);
      expect(parseInt(el3.getAttribute('data-gs-width'))).toBe(1);
      expect(parseInt(el3.getAttribute('data-gs-height'))).toBe(2);

      expect(parseInt(el2.getAttribute('data-gs-x'))).toBe(2);
      expect(parseInt(el2.getAttribute('data-gs-y'))).toBe(0);
      expect(parseInt(el2.getAttribute('data-gs-width'))).toBe(2);
      expect(parseInt(el2.getAttribute('data-gs-height'))).toBe(1);

      // items are item1[1x1], item2[1x1], item3[1x2] in 1 column dom ordered
      grid.column(1);
      expect(parseInt(el1.getAttribute('data-gs-x'))).toBe(0);
      expect(parseInt(el1.getAttribute('data-gs-y'))).toBe(0);
      expect(parseInt(el1.getAttribute('data-gs-width'))).toBe(1);
      expect(parseInt(el1.getAttribute('data-gs-height'))).toBe(1);

      expect(parseInt(el2.getAttribute('data-gs-x'))).toBe(0);
      expect(parseInt(el2.getAttribute('data-gs-y'))).toBe(1);
      expect(parseInt(el2.getAttribute('data-gs-width'))).toBe(1);
      expect(parseInt(el2.getAttribute('data-gs-height'))).toBe(1);

      expect(parseInt(el3.getAttribute('data-gs-x'))).toBe(0);
      expect(parseInt(el3.getAttribute('data-gs-y'))).toBe(2);
      expect(parseInt(el3.getAttribute('data-gs-width'))).toBe(1);
      expect(parseInt(el3.getAttribute('data-gs-height'))).toBe(2);
    });
  });

  describe('disableOneColumnMode', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackSmallHTML); // smaller default to 1 column
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should go to 1 column', function() {
      let grid = GridStack.init();
      expect(grid.getColumn()).toBe(1);
    });
    it('should go to 1 column with large minWidth', function() {
      let grid = GridStack.init({minWidth: 1000});
      expect(grid.getColumn()).toBe(1);
    });
    it('should stay at 12 with minWidth', function() {
      let grid = GridStack.init({minWidth: 300});
      expect(grid.getColumn()).toBe(12);
    });
    it('should stay at 12 column', function() {
      let grid = GridStack.init({disableOneColumnMode: true});
      expect(grid.getColumn()).toBe(12);
    });
  });

  describe('grid.minRow', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should default to row 0 when empty', function() {
      let options = {};
      let grid = GridStack.init(options);
      expect(grid.getRow()).toBe(4);
      expect(grid.opts.minRow).toBe(0);
      expect(grid.opts.maxRow).toBe(0);
      grid.removeAll();
      expect(grid.getRow()).toBe(0);
    });
    it('should default to row 2 when empty', function() {
      let options = {minRow: 2};
      let grid = GridStack.init(options);
      expect(grid.getRow()).toBe(4);
      expect(grid.opts.minRow).toBe(2);
      expect(grid.opts.maxRow).toBe(0);
      grid.removeAll();
      expect(grid.engine.getRow()).toBe(0);
      expect(grid.getRow()).toBe(2);
    });
    it('should set min = max = 3 rows', function() {
      let options = {row: 3};
      let grid = GridStack.init(options);
      expect(grid.getRow()).toBe(3); // shrink elements to fit maxRow!
      expect(grid.opts.minRow).toBe(3);
      expect(grid.opts.maxRow).toBe(3);
      grid.removeAll();
      expect(grid.engine.getRow()).toBe(0);
      expect(grid.getRow()).toBe(3);
    });
    it('willItFit()', function() {
      // default 4x2 and 4x4 so anything pushing more than 1 will fail
      let grid = GridStack.init({maxRow: 5});
      expect(grid.willItFit(0, 0, 1, 1, false)).toBe(true);
      expect(grid.willItFit(0, 0, 1, 3, false)).toBe(true);
      expect(grid.willItFit(0, 0, 1, 4, false)).toBe(false);
      expect(grid.willItFit(0, 0, 12, 1, false)).toBe(true);
      expect(grid.willItFit(0, 0, 12, 2, false)).toBe(false);
    });

  });

  describe('grid attributes', function() {
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should have row attr', function() {
      let HTML = 
        '<div style="width: 800px; height: 600px" id="gs-cont">' +
        '  <div class="grid-stack" data-gs-row="4" data-gs-current-height="1"></div>' + // old attr current-height
        '</div>';
      document.body.insertAdjacentHTML('afterbegin', HTML);
      let grid = GridStack.init();
      expect(grid.getRow()).toBe(4);
      expect(grid.opts.minRow).toBe(4);
      expect(grid.opts.maxRow).toBe(4);
      grid.addWidget({height: 6});
      expect(grid.engine.getRow()).toBe(4);
      expect(grid.getRow()).toBe(4);
    });
  });

  describe('grid.min/max width/height', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should set data-gs-min-width to 2.', function() {
      let grid = GridStack.init();
      let items = Utils.getElements('.grid-stack-item');
      for (let i = 0; i < items.length; i++) {
        grid
          .minWidth(items[i], 2)
          .maxWidth(items[i], 3)
          .minHeight(items[i], 4)
          .maxHeight(items[i], 5);
      }
      for (let j = 0; j < items.length; j++) {
        expect(parseInt(items[j].getAttribute('data-gs-min-width'), 10)).toBe(2);
        expect(parseInt(items[j].getAttribute('data-gs-max-width'), 10)).toBe(3);
        expect(parseInt(items[j].getAttribute('data-gs-min-height'), 10)).toBe(4);
        expect(parseInt(items[j].getAttribute('data-gs-max-height'), 10)).toBe(5);
      }
      // remove all constrain
      grid
        .minWidth('grid-stack-item', 0)
        .maxWidth('.grid-stack-item', null)
        .minHeight('grid-stack-item', undefined)
        .maxHeight(undefined, 0);
      for (let j = 0; j < items.length; j++) {
        expect(items[j].getAttribute('data-gs-min-width')).toBe(null);
        expect(items[j].getAttribute('data-gs-max-width')).toBe(null);
        expect(items[j].getAttribute('data-gs-min-height')).toBe(null);
        expect(items[j].getAttribute('data-gs-max-height')).toBe(null);
      }
    });
  });


  describe('grid.isAreaEmpty', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should set return false.', function() {
      let options = {
        cellHeight: 80,
        margin: 5
      };
      let grid = GridStack.init(options);
      let shouldBeFalse = grid.isAreaEmpty(1, 1, 1, 1);
      expect(shouldBeFalse).toBe(false);
    });
    it('should set return true.', function() {
      let options = {
        cellHeight: 80,
        margin: 5
      };
      let grid = GridStack.init(options);
      let shouldBeTrue = grid.isAreaEmpty(5, 5, 1, 1);
      expect(shouldBeTrue).toBe(true);
    });
  });

  describe('grid.removeAll', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should remove all children by default', function() {
      let grid = GridStack.init();
      grid.removeAll();
      expect(grid.engine.nodes).toEqual([]);
      expect(document.getElementById('item1')).toBe(null);
    });
    it('should remove all children', function() {
      let grid = GridStack.init();
      grid.removeAll(true);
      expect(grid.engine.nodes).toEqual([]);
      expect(document.getElementById('item1')).toBe(null);
    });
    it('should remove gridstack part, leave DOM behind', function() {
      let grid = GridStack.init();
      grid.removeAll(false);
      expect(grid.engine.nodes).toEqual([]);
      expect(document.getElementById('item1')).not.toBe(null);
    });
  });

  describe('grid.removeWidget', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should remove first item (default), then second (true), then third (false)', function() {
      let grid = GridStack.init();
      expect(grid.engine.nodes.length).toEqual(2);

      let el1 = document.getElementById('item1');
      expect(el1).not.toBe(null);
      grid.removeWidget(el1);
      expect(grid.engine.nodes.length).toEqual(1);
      expect(document.getElementById('item1')).toBe(null);
      expect(document.getElementById('item2')).not.toBe(null);

      let el2 = document.getElementById('item2');
      grid.removeWidget(el2, true);
      expect(grid.engine.nodes.length).toEqual(0);
      expect(document.getElementById('item2')).toBe(null);

      let el3 = grid.addWidget(widgetHTML);
      expect(el3).not.toBe(null);
      grid.removeWidget(el3, false);
      expect(grid.engine.nodes.length).toEqual(0);
      expect(document.getElementById('item3')).not.toBe(null);
    });
  });

  describe('grid method _packNodes with float', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should allow same x, y coordinates for widgets.', function() {
      let options = {
        cellHeight: 80,
        margin: 5,
        float: true
      };
      let grid = GridStack.init(options);
      let items = Utils.getElements('.grid-stack-item');
      for (let i = 0; i < items.length; i++) {
        let el = grid.addWidget(items[i]);
        let oldEl = items[i];
        expect(parseInt(oldEl.getAttribute('data-gs-x'), 10)).toBe(parseInt(el.getAttribute('data-gs-x'), 10));
        expect(parseInt(oldEl.getAttribute('data-gs-y'), 10)).toBe(parseInt(el.getAttribute('data-gs-y'), 10));
      }
    });
    it('should not allow same x, y coordinates for widgets.', function() {
      let options = {
        cellHeight: 80,
        margin: 5
      };
      let grid = GridStack.init(options);
      let items = Utils.getElements('.grid-stack-item');
      for (let i = 0; i < items.length; i++) {
        let el = items[i].cloneNode(true) as HTMLElement;
        el = grid.addWidget(el);
        expect(parseInt(el.getAttribute('data-gs-y'), 10)).not.toBe(parseInt(items[i].getAttribute('data-gs-y'), 10));
      }
    });
  });

  describe('grid method addWidget with all parameters', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should keep all widget options the same (autoPosition off', function() {
      let grid = GridStack.init({float: true});;
      let widget = grid.addWidget({x: 6, y:7, width:2, height:3, autoPosition:false,
        minWidth:1, maxWidth:4, minHeight:2, maxHeight:5, id:'coolWidget'});
      
      expect(parseInt(widget.getAttribute('data-gs-x'), 10)).toBe(6);
      expect(parseInt(widget.getAttribute('data-gs-y'), 10)).toBe(7);
      expect(parseInt(widget.getAttribute('data-gs-width'), 10)).toBe(2);
      expect(parseInt(widget.getAttribute('data-gs-height'), 10)).toBe(3);
      expect(widget.getAttribute('data-gs-auto-position')).toBe(null);
      expect(parseInt(widget.getAttribute('data-gs-min-width'), 10)).toBe(1);
      expect(parseInt(widget.getAttribute('data-gs-max-width'), 10)).toBe(4);
      expect(parseInt(widget.getAttribute('data-gs-min-height'), 10)).toBe(2);
      expect(parseInt(widget.getAttribute('data-gs-max-height'), 10)).toBe(5);
      expect(widget.getAttribute('data-gs-id')).toBe('coolWidget');

      // should move widget to top with float=false
      expect(grid.getFloat()).toBe(true);
      grid.float(false);
      expect(grid.getFloat()).toBe(false);
      expect(parseInt(widget.getAttribute('data-gs-x'), 10)).toBe(6);
      expect(parseInt(widget.getAttribute('data-gs-y'), 10)).toBe(4); // <--- from 7 to 4 below second original widget
      expect(parseInt(widget.getAttribute('data-gs-width'), 10)).toBe(2);
      expect(parseInt(widget.getAttribute('data-gs-height'), 10)).toBe(3);
      expect(widget.getAttribute('data-gs-auto-position')).toBe(null);
      expect(parseInt(widget.getAttribute('data-gs-min-width'), 10)).toBe(1);
      expect(parseInt(widget.getAttribute('data-gs-max-width'), 10)).toBe(4);
      expect(parseInt(widget.getAttribute('data-gs-min-height'), 10)).toBe(2);
      expect(parseInt(widget.getAttribute('data-gs-max-height'), 10)).toBe(5);
      expect(widget.getAttribute('data-gs-id')).toBe('coolWidget');

      // should not move again (no-op)
      grid.float(true);
      expect(grid.getFloat()).toBe(true);
      expect(parseInt(widget.getAttribute('data-gs-x'), 10)).toBe(6);
      expect(parseInt(widget.getAttribute('data-gs-y'), 10)).toBe(4);
      expect(parseInt(widget.getAttribute('data-gs-width'), 10)).toBe(2);
      expect(parseInt(widget.getAttribute('data-gs-height'), 10)).toBe(3);
      expect(widget.getAttribute('data-gs-auto-position')).toBe(null);
      expect(parseInt(widget.getAttribute('data-gs-min-width'), 10)).toBe(1);
      expect(parseInt(widget.getAttribute('data-gs-max-width'), 10)).toBe(4);
      expect(parseInt(widget.getAttribute('data-gs-min-height'), 10)).toBe(2);
      expect(parseInt(widget.getAttribute('data-gs-max-height'), 10)).toBe(5);
      expect(widget.getAttribute('data-gs-id')).toBe('coolWidget');
    });
  });

  describe('grid method addWidget with autoPosition true', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should change x, y coordinates for widgets.', function() {
      let grid = GridStack.init({float: true});
      let widget = grid.addWidget({x:9, y:7, width:2, height:3, autoPosition:true});
      
      expect(parseInt(widget.getAttribute('data-gs-x'), 10)).not.toBe(9);
      expect(parseInt(widget.getAttribute('data-gs-y'), 10)).not.toBe(7);
    });
  });

  describe('grid method addWidget with widget options', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should autoPosition (missing X,Y)', function() {
      let grid = GridStack.init();
      let widget = grid.addWidget({height: 2, id: 'optionWidget'});
      
      expect(parseInt(widget.getAttribute('data-gs-x'), 10)).toBe(8);
      expect(parseInt(widget.getAttribute('data-gs-y'), 10)).toBe(0);
      expect(parseInt(widget.getAttribute('data-gs-width'), 10)).toBe(1);
      expect(parseInt(widget.getAttribute('data-gs-height'), 10)).toBe(2);
      // expect(widget.getAttribute('data-gs-auto-position')).toBe('true');
      expect(widget.getAttribute('data-gs-min-width')).toBe(null);
      expect(widget.getAttribute('data-gs-max-width')).toBe(null);
      expect(widget.getAttribute('data-gs-min-height')).toBe(null);
      expect(widget.getAttribute('data-gs-max-height')).toBe(null);
      expect(widget.getAttribute('data-gs-id')).toBe('optionWidget');
    });
    it('should autoPosition (missing X)', function() {
      let grid = GridStack.init();
      let widget = grid.addWidget({y: 9, height: 2, id: 'optionWidget'});
      
      expect(parseInt(widget.getAttribute('data-gs-x'), 10)).toBe(8);
      expect(parseInt(widget.getAttribute('data-gs-y'), 10)).toBe(0);
      expect(parseInt(widget.getAttribute('data-gs-width'), 10)).toBe(1);
      expect(parseInt(widget.getAttribute('data-gs-height'), 10)).toBe(2);
      // expect(widget.getAttribute('data-gs-auto-position')).toBe('true');
      expect(widget.getAttribute('data-gs-min-width')).toBe(null);
      expect(widget.getAttribute('data-gs-max-width')).toBe(null);
      expect(widget.getAttribute('data-gs-min-height')).toBe(null);
      expect(widget.getAttribute('data-gs-max-height')).toBe(null);
      expect(widget.getAttribute('data-gs-id')).toBe('optionWidget');
    });
    it('should autoPosition (missing Y)', function() {
      let grid = GridStack.init();
      let widget = grid.addWidget({x: 9, height: 2, id: 'optionWidget'});
      
      expect(parseInt(widget.getAttribute('data-gs-x'), 10)).toBe(8);
      expect(parseInt(widget.getAttribute('data-gs-y'), 10)).toBe(0);
      expect(parseInt(widget.getAttribute('data-gs-width'), 10)).toBe(1);
      expect(parseInt(widget.getAttribute('data-gs-height'), 10)).toBe(2);
      // expect(widget.getAttribute('data-gs-auto-position')).toBe('true');
      expect(widget.getAttribute('data-gs-min-width')).toBe(null);
      expect(widget.getAttribute('data-gs-max-width')).toBe(null);
      expect(widget.getAttribute('data-gs-min-height')).toBe(null);
      expect(widget.getAttribute('data-gs-max-height')).toBe(null);
      expect(widget.getAttribute('data-gs-id')).toBe('optionWidget');
    });
    it('should autoPosition (correct X, missing Y)', function() {
      let grid = GridStack.init();
      let widget = grid.addWidget({x: 8, height: 2, id: 'optionWidget'});
      
      expect(parseInt(widget.getAttribute('data-gs-x'), 10)).toBe(8);
      expect(parseInt(widget.getAttribute('data-gs-y'), 10)).toBe(0);
      expect(parseInt(widget.getAttribute('data-gs-width'), 10)).toBe(1);
      expect(parseInt(widget.getAttribute('data-gs-height'), 10)).toBe(2);
      // expect(widget.getAttribute('data-gs-auto-position')).toBe('true');
      expect(widget.getAttribute('data-gs-min-width')).toBe(null);
      expect(widget.getAttribute('data-gs-max-width')).toBe(null);
      expect(widget.getAttribute('data-gs-min-height')).toBe(null);
      expect(widget.getAttribute('data-gs-max-height')).toBe(null);
      expect(widget.getAttribute('data-gs-id')).toBe('optionWidget');
    });
    it('should autoPosition (empty options)', function() {
      let grid = GridStack.init();
      let widget = grid.addWidget();
      
      expect(parseInt(widget.getAttribute('data-gs-x'), 10)).toBe(8);
      expect(parseInt(widget.getAttribute('data-gs-y'), 10)).toBe(0);
      expect(parseInt(widget.getAttribute('data-gs-width'), 10)).toBe(1);
      expect(parseInt(widget.getAttribute('data-gs-height'), 10)).toBe(1);
      // expect(widget.getAttribute('data-gs-auto-position')).toBe('true');
      expect(widget.getAttribute('data-gs-min-width')).toBe(null);
      expect(widget.getAttribute('data-gs-max-width')).toBe(null);
      expect(widget.getAttribute('data-gs-min-height')).toBe(null);
      expect(widget.getAttribute('data-gs-max-height')).toBe(null);
    });

  });

  describe('addWidget()', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('bad string options should use default', function() {
      let grid = GridStack.init();
      let widget = grid.addWidget({x: 'foo', y: null, width: 'bar', height: ''} as any);
      
      expect(parseInt(widget.getAttribute('data-gs-x'), 10)).toBe(8);
      expect(parseInt(widget.getAttribute('data-gs-y'), 10)).toBe(0);
      expect(parseInt(widget.getAttribute('data-gs-width'), 10)).toBe(1);
      expect(parseInt(widget.getAttribute('data-gs-height'), 10)).toBe(1);
    });
    it('null options should clear x position', function() {
      let grid = GridStack.init({float: true});
      let HTML = '<div class="grid-stack-item" data-gs-x="9"><div class="grid-stack-item-content"></div></div>';
      let widget = grid.addWidget(HTML, {x:null, y:null, width:undefined});
      
      expect(parseInt(widget.getAttribute('data-gs-x'), 10)).toBe(8);
      expect(parseInt(widget.getAttribute('data-gs-y'), 10)).toBe(0);
    });
    it('width attr should be retained', function() { // #1276
      let grid = GridStack.init({float: true});
      let HTML = '<div class="grid-stack-item" data-gs-width="3" data-gs-max-width="4" data-gs-id="foo"><div class="grid-stack-item-content"></div></div>';
      let widget = grid.addWidget(HTML, {x: 1, y: 5});
      expect(parseInt(widget.getAttribute('data-gs-x'), 10)).toBe(1);
      expect(parseInt(widget.getAttribute('data-gs-y'), 10)).toBe(5);
      expect(parseInt(widget.getAttribute('data-gs-width'), 10)).toBe(3);
      expect(parseInt(widget.getAttribute('data-gs-max-width'), 10)).toBe(4);
      expect(parseInt(widget.getAttribute('data-gs-height'), 10)).toBe(1);
      expect(widget.getAttribute('data-gs-id')).toBe('foo');
    });
  });

  describe('makeWidget()', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackEmptyHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('passing element', function() {
      let grid = GridStack.init();
      let doc = document.implementation.createHTMLDocument();
      doc.body.innerHTML = '<div><div class="grid-stack-item-content"></div></div>';
      let el = doc.body.children[0] as HTMLElement;
      grid.el.appendChild(el);
      let widget = grid.makeWidget(el);
      expect(parseInt(widget.getAttribute('data-gs-x'), 10)).toBe(0);
    });
    it('passing class', function() {
      let grid = GridStack.init();
      let doc = document.implementation.createHTMLDocument();
      doc.body.innerHTML = '<div class="item"><div class="grid-stack-item-content"></div></div>';
      let el = doc.body.children[0] as HTMLElement;
      grid.el.appendChild(el);
      let widget = grid.makeWidget('.item');
      expect(parseInt(widget.getAttribute('data-gs-x'), 10)).toBe(0);
    });
    it('passing class no dot', function() {
      let grid = GridStack.init();
      let doc = document.implementation.createHTMLDocument();
      doc.body.innerHTML = '<div class="item"><div class="grid-stack-item-content"></div></div>';
      let el = doc.body.children[0] as HTMLElement;
      grid.el.appendChild(el);
      let widget = grid.makeWidget('item');
      expect(parseInt(widget.getAttribute('data-gs-x'), 10)).toBe(0);
    });
    it('passing id', function() {
      let grid = GridStack.init();
      let doc = document.implementation.createHTMLDocument();
      doc.body.innerHTML = '<div id="item"><div class="grid-stack-item-content"></div></div>';
      let el = doc.body.children[0] as HTMLElement;
      grid.el.appendChild(el);
      let widget = grid.makeWidget('#item');
      expect(parseInt(widget.getAttribute('data-gs-x'), 10)).toBe(0);
    });
    it('passing id no #', function() {
      let grid = GridStack.init();
      let doc = document.implementation.createHTMLDocument();
      doc.body.innerHTML = '<div id="item"><div class="grid-stack-item-content"></div></div>';
      let el = doc.body.children[0] as HTMLElement;
      grid.el.appendChild(el);
      let widget = grid.makeWidget('item');
      expect(parseInt(widget.getAttribute('data-gs-x'), 10)).toBe(0);
    });
    it('passing id as number', function() {
      let grid = GridStack.init();
      let doc = document.implementation.createHTMLDocument();
      doc.body.innerHTML = '<div id="1"><div class="grid-stack-item-content"></div></div>';
      let el = doc.body.children[0] as HTMLElement;
      grid.el.appendChild(el);
      let widget = grid.makeWidget('1');
      expect(parseInt(widget.getAttribute('data-gs-x'), 10)).toBe(0);
    });
  });

  describe('method getFloat()', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should match true/false only', function() {
      let grid = GridStack.init({float: true});
      expect(grid.getFloat()).toBe(true);
      (grid as any).float(0);
      expect(grid.getFloat()).toBe(false);
      grid.float(null);
      expect(grid.getFloat()).toBe(false);
      grid.float(undefined);
      expect(grid.getFloat()).toBe(false);
      grid.float(false);
      expect(grid.getFloat()).toBe(false);
    });
  });

  describe('grid.destroy', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      //document.body.removeChild(document.getElementsByClassName('grid-stack')[0]);
    });
    it('should cleanup gridstack', function() {
      let options = {
        cellHeight: 80,
        margin: 5
      };
      let grid = GridStack.init(options);
      grid.destroy();
      expect(grid.el.parentElement).toBe(null);
      expect(grid.engine).toBe(undefined);
    });
    it('should cleanup gridstack but leave elements', function() {
      let options = {
        cellHeight: 80,
        margin: 5
      };
      let grid = GridStack.init(options);
      grid.destroy(false);
      expect(grid.el.parentElement).not.toBe(null);
      expect(Utils.getElements('.grid-stack-item').length).toBe(2);
      expect(grid.engine).toBe(undefined);
      grid.destroy();
    });
  });

  describe('grid.resize', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should resize widget', function() {
      let options = {
        cellHeight: 80,
        margin: 5
      };
      let grid = GridStack.init(options);
      let items = Utils.getElements('.grid-stack-item');
      grid.resize(items[0], 5, 5);
      expect(parseInt(items[0].getAttribute('data-gs-width'), 10)).toBe(5);
      expect(parseInt(items[0].getAttribute('data-gs-height'), 10)).toBe(5);
    });
  });

  describe('grid.move', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should move widget', function() {
      let options = {
        cellHeight: 80,
        margin: 5,
        float: true
      };
      let grid = GridStack.init(options);
      let items = Utils.getElements('.grid-stack-item');
      grid.move(items[0], 5, 5);
      expect(parseInt(items[0].getAttribute('data-gs-x'), 10)).toBe(5);
      expect(parseInt(items[0].getAttribute('data-gs-y'), 10)).toBe(5);
    });
  });

  describe('grid.update', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should move and resize widget', function() {
      let grid = GridStack.init({float: true});
      let el = Utils.getElements('.grid-stack-item')[1];
      expect(parseInt(el.getAttribute('data-gs-width'), 10)).toBe(4);
      
      grid.update(el, {x: 5, y: 4, height: 2});
      expect(parseInt(el.getAttribute('data-gs-x'), 10)).toBe(5);
      expect(parseInt(el.getAttribute('data-gs-y'), 10)).toBe(4);
      expect(parseInt(el.getAttribute('data-gs-width'), 10)).toBe(4);
      expect(parseInt(el.getAttribute('data-gs-height'), 10)).toBe(2);
    });
    it('should change noMove', function() {
      let grid = GridStack.init({float: true});
      let items = Utils.getElements('.grid-stack-item');
      let el = items[1];
      let dd = GridStackDD.get();
      
      grid.update(el, {noMove: true, noResize: false});
      expect(el.getAttribute('data-gs-no-move')).toBe('true');
      expect(el.getAttribute('data-gs-no-resize')).toBe(null); // false is no-op
      expect(dd.isResizable(el)).toBe(true);
      expect(dd.isDraggable(el)).toBe(false);
      expect(dd.isResizable(items[0])).toBe(true);
      expect(dd.isDraggable(items[0])).toBe(true);

      expect(parseInt(el.getAttribute('data-gs-x'), 10)).toBe(4);
      expect(parseInt(el.getAttribute('data-gs-y'), 10)).toBe(0);
      expect(parseInt(el.getAttribute('data-gs-width'), 10)).toBe(4);
      expect(parseInt(el.getAttribute('data-gs-height'), 10)).toBe(4);
    });
    it('should change content and id, and move', function() {
      let grid = GridStack.init({float: true});
      let items = Utils.getElements('.grid-stack-item');
      let el = items[1];
      let sub = el.querySelector('.grid-stack-item-content');

      grid.update(el, {id: 'newID', y: 1, content: 'new content'});
      expect(el.getAttribute('data-gs-id')).toBe('newID');
      expect(sub.innerHTML).toBe('new content');
      expect(parseInt(el.getAttribute('data-gs-x'), 10)).toBe(4);
      expect(parseInt(el.getAttribute('data-gs-y'), 10)).toBe(1);
      expect(parseInt(el.getAttribute('data-gs-width'), 10)).toBe(4);
      expect(parseInt(el.getAttribute('data-gs-height'), 10)).toBe(4);
    });
    it('should change max and constrain a wanted resize', function() {
      let grid = GridStack.init({float: true});
      let items = Utils.getElements('.grid-stack-item');
      let el = items[1];
      expect(el.getAttribute('data-gs-max-width')).toBe(null);

      grid.update(el, {maxWidth: 2, width: 5});
      expect(parseInt(el.getAttribute('data-gs-x'), 10)).toBe(4);
      expect(parseInt(el.getAttribute('data-gs-y'), 10)).toBe(0);
      expect(parseInt(el.getAttribute('data-gs-width'), 10)).toBe(2);
      expect(parseInt(el.getAttribute('data-gs-height'), 10)).toBe(4);
      expect(parseInt(el.getAttribute('data-gs-max-width'), 10)).toBe(2);
    });
    it('should change max and constrain existing', function() {
      let grid = GridStack.init({float: true});
      let items = Utils.getElements('.grid-stack-item');
      let el = items[1];
      expect(el.getAttribute('data-gs-max-width')).toBe(null);

      grid.update(el, {maxWidth: 2});
      expect(parseInt(el.getAttribute('data-gs-x'), 10)).toBe(4);
      expect(parseInt(el.getAttribute('data-gs-y'), 10)).toBe(0);
      expect(parseInt(el.getAttribute('data-gs-height'), 10)).toBe(4);
      expect(parseInt(el.getAttribute('data-gs-max-width'), 10)).toBe(2);
      expect(parseInt(el.getAttribute('data-gs-width'), 10)).toBe(2);
    });
    it('should change all max and move', function() {
      let grid = GridStack.init({float: true});
      let items = Utils.getElements('.grid-stack-item');

      items.forEach(item => {
        expect(item.getAttribute('data-gs-max-width')).toBe(null);
        expect(item.getAttribute('data-gs-max-height')).toBe(null);
      });

      grid.update('.grid-stack-item', {maxWidth: 2, maxHeight: 2});
      expect(parseInt(items[0].getAttribute('data-gs-x'), 10)).toBe(0);
      expect(parseInt(items[1].getAttribute('data-gs-x'), 10)).toBe(4);
      items.forEach(item => {
        expect(parseInt(item.getAttribute('data-gs-y'), 10)).toBe(0);
        expect(parseInt(item.getAttribute('data-gs-height'), 10)).toBe(2);
        expect(parseInt(item.getAttribute('data-gs-width'), 10)).toBe(2);
        expect(parseInt(item.getAttribute('data-gs-max-width'), 10)).toBe(2);
        expect(parseInt(item.getAttribute('data-gs-max-height'), 10)).toBe(2);
      });
    });

  });

  describe('grid.margin', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should return margin', function() {
      let options = {
        cellHeight: 80,
        margin: 12
      };
      let grid = GridStack.init(options);
      expect(grid.getMargin()).toBe(12);
    });
    it('should return update margin', function() {
      let options = {
        cellHeight: 80,
        margin: 5
      };
      let grid = GridStack.init(options);
      grid.margin('11rem');
      expect(grid.getMargin()).toBe(11);
    });
    it('should change unit', function() {
      let options = {
        cellHeight: 80,
        margin: 10,
      };
      let grid = GridStack.init(options);
      expect(grid.getMargin()).toBe(10);
      grid.margin('10rem');
      expect(grid.getMargin()).toBe(10);
    });
    it('should not update styles, with same value', function() {
      let options = {
        cellHeight: 80,
        margin: 5
      };
      let grid: any = GridStack.init(options);
      expect(grid.getMargin()).toBe(5);
      spyOn(grid, '_updateStyles');
      grid.margin('5px');
      expect(grid._updateStyles).not.toHaveBeenCalled();
      expect(grid.getMargin()).toBe(5);
    });
    it('should set top/bot/left value directly', function() {
      let options = {
        cellHeight: 80,
        marginTop: 5,
        marginBottom: 0,
        marginLeft: 1,
      };
      let grid: any = GridStack.init(options);
      expect(grid.getMargin()).toBe(undefined);
      expect(grid.opts.marginTop).toBe(5);
      expect(grid.opts.marginBottom).toBe(0);
      expect(grid.opts.marginLeft).toBe(1);
      expect(grid.opts.marginRight).toBe(10); // default value
    });
    it('should set all 4 sides, and overall margin', function() {
      let options = {
        cellHeight: 80,
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 5,
        marginRight: 5,
      };
      let grid: any = GridStack.init(options);
      expect(grid.getMargin()).toBe(5);
      expect(grid.opts.marginTop).toBe(5);
      expect(grid.opts.marginBottom).toBe(5);
      expect(grid.opts.marginLeft).toBe(5);
      expect(grid.opts.marginRight).toBe(5);
    });
    it('init 2 values', function() {
      let options = {
        cellHeight: 80,
        margin: '5px 10'
      };
      let grid: any = GridStack.init(options);
      expect(grid.getMargin()).toBe(undefined);
      expect(grid.opts.marginTop).toBe(5);
      expect(grid.opts.marginBottom).toBe(5);
      expect(grid.opts.marginLeft).toBe(10);
      expect(grid.opts.marginRight).toBe(10);
    });
    it('init 4 values', function() {
      let options = {
        cellHeight: 80,
        margin: '1 2 0em 3'
      };
      let grid: any = GridStack.init(options);
      expect(grid.getMargin()).toBe(undefined);
      expect(grid.opts.marginTop).toBe(1);
      expect(grid.opts.marginRight).toBe(2);
      expect(grid.opts.marginBottom).toBe(0);
      expect(grid.opts.marginLeft).toBe(3);
    });
    it('set 2 values, should update style', function() {
      let options = {
        cellHeight: 80,
        margin: 5
      };
      let grid = GridStack.init(options); 
      expect(grid.getMargin()).toBe(5);
      spyOn(grid as any, '_updateStyles');
      grid.margin('1px 0');
      expect((grid as any)._updateStyles).toHaveBeenCalled();
      expect(grid.getMargin()).toBe(undefined);
      expect(grid.opts.marginTop).toBe(1);
      expect(grid.opts.marginBottom).toBe(1);
      expect(grid.opts.marginLeft).toBe(0);
      expect(grid.opts.marginRight).toBe(0);
    });
  });

  describe('grid.opts.rtl', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should add grid-stack-rtl class', function() {
      let options = {
        cellHeight: 80,
        margin: 5,
        rtl: true
      };
      let grid = GridStack.init(options);
      expect(grid.el.classList.contains('grid-stack-rtl')).toBe(true);
    });
    it('should not add grid-stack-rtl class', function() {
      let options = {
        cellHeight: 80,
        margin: 5
      };
      let grid = GridStack.init(options);
      expect(grid.el.classList.contains('grid-stack-rtl')).toBe(false);
    });
  });
  
  describe('grid.opts.styleInHead', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should add STYLE to parent node as a default', function() {
      var options = {
        cellHeight: 80,
        verticalMargin: 10,
        float: false,
      };
      var grid = GridStack.init(options);
      expect((grid as any)._styles.ownerNode.parentNode.tagName).toBe('DIV'); // any to access private _styles
    });
    it('should add STYLE to HEAD if styleInHead === true', function() {
      var options = {
        cellHeight: 80,
        verticalMargin: 10,
        float: false,
        styleInHead: true
      };
      var grid = GridStack.init(options);
      expect((grid as any)._styles.ownerNode.parentNode.tagName).toBe('HEAD'); // any to access private _styles
    });
  });

  describe('grid.opts.styleInHead', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should add STYLE to parent node as a default', function() {
      var grid = GridStack.init();
      expect((grid as any)._styles.ownerNode.parentNode.tagName).toBe('DIV');
    });
    it('should add STYLE to HEAD if styleInHead === true', function() {
      var grid = GridStack.init({styleInHead: true});
      expect((grid as any)._styles.ownerNode.parentNode.tagName).toBe('HEAD');
    });
  });

  describe('grid.enableMove', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should enable move for future also', function() {
      let options = {
        cellHeight: 80,
        margin: 5,
        disableDrag: true
      };
      let grid = GridStack.init(options);
      let items = Utils.getElements('.grid-stack-item');
      for (let i = 0; i < items.length; i++) {
        expect(items[i].classList.contains('ui-draggable-disabled')).toBe(true);
      }
      expect(grid.opts.disableDrag).toBe(true);

      grid.enableMove(true, true);
      for (let i = 0; i < items.length; i++) {
        expect(items[i].classList.contains('ui-draggable-disabled')).toBe(false);
      }
      expect(grid.opts.disableDrag).toBe(false);
    });
    it('should disable move for existing only', function() {
      let options = {
        cellHeight: 80,
        margin: 5
      };
      let grid = GridStack.init(options);
      let items = Utils.getElements('.grid-stack-item');
      for (let i = 0; i < items.length; i++) {
        expect(items[i].classList.contains('ui-draggable-disabled')).toBe(false);
      }
      expect(grid.opts.disableDrag).toBe(false);

      grid.enableMove(false, false);
      for (let i = 0; i < items.length; i++) {
        expect(items[i].classList.contains('ui-draggable-disabled')).toBe(true);
      }
      expect(grid.opts.disableDrag).toBe(false);
    });
  });

  describe('grid.enableResize', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should enable resize', function() {
      let options = {
        cellHeight: 80,
        margin: 5,
        disableResize: true
      };
      let grid = GridStack.init(options);
      expect(grid.opts.disableResize).toBe(true);
      let items = Utils.getElements('.grid-stack-item');
      let dd = GridStackDD.get();
      // expect(dd).toBe(null); // sanity test to verify type
      for (let i = 0; i < items.length; i++) {
        expect(dd.isResizable(items[i])).toBe(false);
        expect(dd.isDraggable(items[i])).toBe(true);
      }
      grid.enableResize(true);
      expect(grid.opts.disableResize).toBe(false);
      for (let i = 0; i < items.length; i++) {
        expect(dd.isResizable(items[i])).toBe(true);
        expect(dd.isDraggable(items[i])).toBe(true);
      }
    });
    it('should disable resize', function() {
      let options = {
        cellHeight: 80,
        margin: 5
      };
      let grid = GridStack.init(options);
      expect(grid.opts.disableResize).toBe(false);
      let items = Utils.getElements('.grid-stack-item');
      let dd = GridStackDD.get();
      for (let i = 0; i < items.length; i++) {
        expect(dd.isResizable(items[i])).toBe(true);
        expect(dd.isDraggable(items[i])).toBe(true);
      }
      grid.enableResize(false);
      expect(grid.opts.disableResize).toBe(true);
      for (let i = 0; i < items.length; i++) {
        expect(dd.isResizable(items[i])).toBe(false);
        expect(dd.isDraggable(items[i])).toBe(true);
      }
    });
  });

  describe('grid.enable', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should enable movable and resizable', function() {
      let options = {
        cellHeight: 80,
        margin: 5
      };
      let grid = GridStack.init(options);
      let items = Utils.getElements('.grid-stack-item');
      let dd = GridStackDD.get();
      grid.enableResize(false);
      grid.enableMove(false);
      for (let i = 0; i < items.length; i++) {
        expect(items[i].classList.contains('ui-draggable-disabled')).toBe(true);
        expect(dd.isResizable(items[i])).toBe(false);
        expect(dd.isDraggable(items[i])).toBe(false);
      }
      grid.enable();
      for (let j = 0; j < items.length; j++) {
        expect(items[j].classList.contains('ui-draggable-disabled')).toBe(false);
        expect(dd.isResizable(items[j])).toBe(true);
        expect(dd.isDraggable(items[j])).toBe(true);
      }
    });
  });

  describe('grid.enable', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should lock widgets', function() {
      let options = {
        cellHeight: 80,
        margin: 5
      };
      let grid = GridStack.init(options);
      grid.locked('.grid-stack-item', true);
      Utils.getElements('.grid-stack-item').forEach(item => {
        expect(item.getAttribute('data-gs-locked')).toBe('true');
      })
    });
    it('should unlock widgets', function() {
      let options = {
        cellHeight: 80,
        margin: 5
      };
      let grid = GridStack.init(options);
      grid.locked('.grid-stack-item', false);
      Utils.getElements('.grid-stack-item').forEach(item => {
        expect(item.getAttribute('data-gs-locked')).toBe(null);
      })
    });
  });

  describe('custom grid placement #1054', function() {
    let HTML = 
    '<div style="width: 800px; height: 600px" id="gs-cont">' +
    '  <div class="grid-stack">' +
    '    <div class="grid-stack-item" data-gs-x="0" data-gs-y="0" data-gs-width="12" data-gs-height="9">' +
    '      <div class="grid-stack-item-content"></div>' +
    '    </div>' +
    '    <div class="grid-stack-item" data-gs-x="0" data-gs-y="9" data-gs-width="12" data-gs-height="5">' +
    '      <div class="grid-stack-item-content"></div>' +
    '    </div>' +
    '    <div class="grid-stack-item" data-gs-x="0" data-gs-y="14" data-gs-width="7" data-gs-height="6">' +
    '      <div class="grid-stack-item-content"></div>' +
    '    </div>' +
    '    <div class="grid-stack-item" data-gs-x="7" data-gs-y="14" data-gs-width="5" data-gs-height="6">' +
    '      <div class="grid-stack-item-content"></div>' +
    '    </div>' +
    '  </div>' +
    '</div>';
    let pos = [{x:0, y:0, w:12, h:9}, {x:0, y:9, w:12, h:5}, {x:0, y:14, w:7, h:6}, {x:7, y:14, w:5, h:6}];
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', HTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should have correct position', function() {
      let items = Utils.getElements('.grid-stack-item');
      for (let i = 0; i < items.length; i++) {
        expect(parseInt(items[i].getAttribute('data-gs-x'))).toBe(pos[i].x);
        expect(parseInt(items[i].getAttribute('data-gs-y'))).toBe(pos[i].y);
        expect(parseInt(items[i].getAttribute('data-gs-width'))).toBe(pos[i].w);
        expect(parseInt(items[i].getAttribute('data-gs-height'))).toBe(pos[i].h);
      }
    });
  });

  describe('grid.compact', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should move all 3 items to top-left with no space', function() {
      let grid = GridStack.init({float: true});

      let el3 = grid.addWidget({x: 3, y: 5});
      expect(parseInt(el3.getAttribute('data-gs-x'))).toBe(3);
      expect(parseInt(el3.getAttribute('data-gs-y'))).toBe(5);

      grid.compact();
      expect(parseInt(el3.getAttribute('data-gs-x'))).toBe(8);
      expect(parseInt(el3.getAttribute('data-gs-y'))).toBe(0);
    });
    it('not move locked item', function() {
      let grid = GridStack.init({float: true});

      let el3 = grid.addWidget({x: 3, y: 5, locked: true, noMove: true});
      expect(parseInt(el3.getAttribute('data-gs-x'))).toBe(3);
      expect(parseInt(el3.getAttribute('data-gs-y'))).toBe(5);

      grid.compact();
      expect(parseInt(el3.getAttribute('data-gs-x'))).toBe(3);
      expect(parseInt(el3.getAttribute('data-gs-y'))).toBe(5);
    });
  });

  describe('gridOption locked #1181', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackEmptyHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('not move locked item, size down added one', function() {
      let grid = GridStack.init();
      let el1 = grid.addWidget({x: 0, y: 1, width: 12, height: 1, locked: true});
      expect(parseInt(el1.getAttribute('data-gs-x'))).toBe(0);
      expect(parseInt(el1.getAttribute('data-gs-y'))).toBe(1);

      let el2 = grid.addWidget({x: 2, y: 0, height: 3});
      expect(parseInt(el1.getAttribute('data-gs-x'))).toBe(0);
      expect(parseInt(el1.getAttribute('data-gs-y'))).toBe(1);
      expect(parseInt(el2.getAttribute('data-gs-x'))).toBe(2);
      expect(parseInt(el2.getAttribute('data-gs-y'))).toBe(2);
      expect(parseInt(el2.getAttribute('data-gs-height'))).toBe(3);
    });

  });

  describe('nested grids', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackNestedHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should both init, second with nested class', function() {
      let grids = GridStack.initAll();
      expect(grids.length).toBe(2);
      expect(grids[0].el.classList.contains('grid-stack-nested')).toBe(false);
      expect(grids[1].el.classList.contains('grid-stack-nested')).toBe(true);
    });
  });

  describe('two grids', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridHTML);
      document.body.insertAdjacentHTML('afterbegin', gridHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('should not remove incorrect child', function() {
      let grids = GridStack.initAll();
      expect(grids.length).toBe(2);
      expect(grids[0].engine.nodes.length).toBe(2);
      expect(grids[1].engine.nodes.length).toBe(2);
      // should do nothing
      grids[0].removeWidget( grids[1].engine.nodes[0].el );
      expect(grids[0].engine.nodes.length).toBe(2);
      expect(grids[0].el.children.length).toBe(2);
      expect(grids[1].engine.nodes.length).toBe(2);
      expect(grids[1].el.children.length).toBe(2);
      // should empty with no errors
      grids[1].removeAll();
      expect(grids[0].engine.nodes.length).toBe(2);
      expect(grids[0].el.children.length).toBe(2);
      expect(grids[1].engine.nodes.length).toBe(0);
      expect(grids[1].el.children.length).toBe(0);
    });
    it('should remove 1 child', function() {
      let grids = GridStack.initAll();
      grids[1].removeWidget( grids[1].engine.nodes[0].el );
      expect(grids[0].engine.nodes.length).toBe(2);
      expect(grids[0].el.children.length).toBe(2);
      expect(grids[1].engine.nodes.length).toBe(1);
      expect(grids[1].el.children.length).toBe(1);
    });
  });

  describe('grid.on events', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('add 3 single events', function() {
      let grid = GridStack.init();
      let fcn = (event: Event) => {};
      grid.on('added', fcn).on('enable', fcn).on('dragstart', fcn);
      expect((grid as any)._gsEventHandler.enable).not.toBe(undefined);
      grid.off('added').off('enable').off('dragstart');
      expect((grid as any)._gsEventHandler.enable).toBe(undefined);
    });
    it('add 3 events', function() {
      let grid: any = GridStack.init(); // prevent TS check for string combine...
      let fcn = (event: CustomEvent) => {};
      grid.on('added enable dragstart', fcn);
      expect((grid as any)._gsEventHandler.enable).not.toBe(undefined);
      grid.off('added enable dragstart');
      expect((grid as any)._gsEventHandler.enable).toBe(undefined);
    });

  });

  describe('save & load', function() {
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('save layout', function() {
      let grid = GridStack.init();
      let layout = grid.save(false);
      expect(layout).toEqual([{x:0, y:0, width:4, height:2, id:'gsItem1'}, {x:4, y:0, width:4, height:4, id:'gsItem2'}]);
      layout = grid.save();
      expect(layout).toEqual([{x:0, y:0, width:4, height:2, id:'gsItem1', content:'item 1 text'}, {x:4, y:0, width:4, height:4, id:'gsItem2', content:'item 2 text'}]);
      layout = grid.save(true);
      expect(layout).toEqual([{x:0, y:0, width:4, height:2, id:'gsItem1', content:'item 1 text'}, {x:4, y:0, width:4, height:4, id:'gsItem2', content:'item 2 text'}]);
    });
    it('load move 1 item, delete others', function() {
      let grid = GridStack.init();
      grid.load([{x:2, height:1, id:'gsItem2'}]);
      let layout = grid.save(false);
      expect(layout).toEqual([{x:2, y:0, width:4, height:1, id:'gsItem2'}]);
    });
    it('load add new, delete others', function() {
      let grid = GridStack.init();
      grid.load([{width:2, height:1, id:'gsItem3'}], true);
      let layout = grid.save(false);
      expect(layout).toEqual([{x:0, y:0, width:2, height:1, id:'gsItem3'}]);
    });
    it('load size 1 item only', function() {
      let grid = GridStack.init();
      grid.load([{height:3, id:'gsItem1'}], false);
      let layout = grid.save(false);
      expect(layout).toEqual([{x:0, y:0, width:4, height:3, id:'gsItem1'}, {x:4, y:0, width:4, height:4, id:'gsItem2'}]);
    });
    it('load size 1 item only with callback', function() {
      let grid = GridStack.init();
      grid.load([{height:3, id:'gsItem1'}], () => {});
      let layout = grid.save(false);
      expect(layout).toEqual([{x:0, y:0, width:4, height:3, id:'gsItem1'}, {x:4, y:0, width:4, height:4, id:'gsItem2'}]);
    });
  });

 // ..and finally track log warnings at the end, instead of displaying them....
  describe('obsolete warnings', function() {
    console.warn = jasmine.createSpy('log'); // track warnings instead of displaying them
    beforeEach(function() {
      document.body.insertAdjacentHTML('afterbegin', gridstackHTML);
    });
    afterEach(function() {
      document.body.removeChild(document.getElementById('gs-cont'));
    });
    it('warning if OLD setGridWidth is called', function() {
      let grid: any = GridStack.init();
      grid.setGridWidth(11); // old 0.5.2 API
      expect(grid.getColumn()).toBe(11);
      expect(console.warn).toHaveBeenCalledWith('gridstack.js: Function `setGridWidth` is deprecated in v0.5.3 and has been replaced with `column`. It will be **completely** removed in v1.0');
    });
    it('warning if OLD setColumn is called', function() {
      let grid: any = GridStack.init();
      grid.setColumn(10); // old 0.6.4 API
      expect(grid.getColumn()).toBe(10);
      expect(console.warn).toHaveBeenCalledWith('gridstack.js: Function `setColumn` is deprecated in v0.6.4 and has been replaced with `column`. It will be **completely** removed in v1.0');
    });
    it('warning if OLD grid height is set', function() {
      let grid = (GridStack as any).init({height: 10}); // old 0.5.2 Opt now maxRow
      expect(grid.opts.maxRow).toBe(10);
      expect(grid.engine.maxRow).toBe(10);
      expect(console.warn).toHaveBeenCalledWith('gridstack.js: Option `height` is deprecated in v0.5.3 and has been replaced with `maxRow`. It will be **completely** removed in v1.0');
    });
    it('warning if OLD oneColumnModeClass is set (no changes)', function() {
      (GridStack as any).init({oneColumnModeClass: 'foo'}); // deleted 0.6.3 Opt
      expect(console.warn).toHaveBeenCalledWith('gridstack.js: Option `oneColumnModeClass` is deprecated in v0.6.3. Use class `.grid-stack-1` instead');
    });
  });
});
