// Generated by CoffeeScript 1.6.3
/*
# Touch Tabs JQuery was created by Cole Lawrence(github:ZombieHippie)
# This work is licensed under the Creative Commons Attribution-ShareAlike 3.0
# Unported License. To view a copy of this license, visit http://creativecommons.org/licenses/by-sa/3.0/.
*/

var TouchTabs,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

$.fn.touchTabs = function() {
  this.addClass('TouchTabs');
  return new TouchTabs(this);
};

TouchTabs = (function() {
  function TouchTabs(element) {
    this.element = element;
    this.move = __bind(this.move, this);
    this.closeTabById = __bind(this.closeTabById, this);
    this.renameTabById = __bind(this.renameTabById, this);
    this.activateTabById = __bind(this.activateTabById, this);
    this.bindTouch = __bind(this.bindTouch, this);
    this.createTab = __bind(this.createTab, this);
    this.onTouchMove = __bind(this.onTouchMove, this);
    this.onMouseMove = __bind(this.onMouseMove, this);
    this.onTouchEnd = __bind(this.onTouchEnd, this);
    this.onMouseLeave = __bind(this.onMouseLeave, this);
    this.startMouse = __bind(this.startMouse, this);
    this.onClickClose = __bind(this.onClickClose, this);
    this.on = __bind(this.on, this);
    this.element.on('mousedown', 'li', this.startMouse);
    this.element.on('click', 'span.tab-close', this.onClickClose);
    this.element.on('mousedown', 'span.tab-close', function(event) {
      return event.stopPropagation();
    });
    $(document).on('mouseleave', this.onMouseLeave);
    $(document).on('mousemove', this.onMouseMove);
    this.element.on('touchend', this.onTouchEnd);
    this.element.on('touchcancel', this.onTouchEnd);
    this.element.on('touchleave', this.onTouchEnd);
    this.element.on('touchmove', this.onTouchMove);
    this.dragging = false;
    this.drag15px = false;
    this.initMouseX = 0;
    this.tabWidth = this.element.find('li').width();
  }

  TouchTabs.prototype.on = function(eventType, fn) {
    return this.element.on(eventType, fn);
  };

  TouchTabs.prototype.onClickClose = function(event) {
    var rem;
    rem = $(event.target).parents('li.closeable');
    return this.removeTab(rem);
  };

  TouchTabs.prototype.startMouse = function(event) {
    var clos, id;
    this.initMouseX = event.clientX;
    id = $(event.target).parents('li').attr('tabid');
    if (event.button === 0) {
      this.activateTabById(id);
    }
    if (event.button === 1) {
      clos = this.findById(this.element, id, "check middle mouse click");
      if (clos.hasClass('closeable')) {
        this.closeTabById(id);
      }
      event.preventDefault();
    }
    return this.dragging = true;
  };

  TouchTabs.prototype.onMouseLeave = function() {
    if (this.drag15px) {
      this.element.find('.tab-active:first').animate({
        'left': '0'
      });
    }
    this.dragging = false;
    return this.drag15px = false;
  };

  TouchTabs.prototype.onTouchEnd = function(event) {
    if (this.dragging) {
      this.element.find('.tab-active:first').animate({
        'left': '0'
      });
    }
    return this.dragging = false;
  };

  TouchTabs.prototype.onMouseMove = function(event) {
    var whichM;
    if (!this.dragging) {
      return;
    }
    whichM = typeof event.buttons !== 'undefined' ? event.buttons : event.which;
    if (whichM !== 1) {
      return this.onMouseLeave();
    }
    event.preventDefault();
    return this.move(event.clientX);
  };

  TouchTabs.prototype.onTouchMove = function(event) {
    this.dragging = true;
    event.preventDefault();
    event.stopPropagation();
    return this.move(event.originalEvent.changedTouches[0].pageX);
  };

  TouchTabs.prototype.createTab = function(id, title, closeable) {
    var tab;
    if (closeable == null) {
      closeable = true;
    }
    tab = "<li tabid=\"" + id + "\"><span>            <span class=\"title\">" + title + "</span>            " + (closeable ? "<span class=\"tab-close\"></span>" : "") + "          </span></li>";
    this.element.append(tab);
    tab = this.element.find('li:last');
    this.tabWidth = tab.width();
    if (closeable) {
      tab.addClass("closeable");
    }
    this.element.trigger('tabcreate', [id, title]);
    this.bindTouch(tab);
    return this.activateTabById(id);
  };

  TouchTabs.prototype.bindTouch = function(tabElem) {
    var tabid,
      _this = this;
    tabid = tabElem.attr('tabid');
    tabElem.bind("touchstart", function(event) {
      _this.activateTabById(tabid);
      _this.initMouseX = event.originalEvent.changedTouches[0].pageX;
      event.preventDefault();
      event.stopPropagation();
      return _this.dragging = true;
    });
    return tabElem.find("span.tab-close").bind("touchstart", function(event) {
      _this.closeTabById(tabid);
      return event.stopPropagation();
    });
  };

  TouchTabs.prototype.activateTabById = function(id, trigger) {
    var act;
    if (trigger == null) {
      trigger = true;
    }
    act = this.findById(this.element, id, "tab activation");
    if (act === null) {
      return;
    }
    this.element.find('.tab-active').removeClass('tab-active');
    act.addClass('tab-active');
    return this.element.trigger('tabactivate', [act.attr('tabid')]);
  };

  TouchTabs.prototype.renameTabById = function(id, newname) {
    var act;
    act = this.findById(this.element, id, "tab renaming");
    if (act === null) {
      return;
    }
    act = act.find("span>span.title");
    return act.html(newname);
  };

  TouchTabs.prototype.closeTabById = function(id, trigger) {
    var needToActivateNewTab, rem,
      _this = this;
    if (trigger == null) {
      trigger = true;
    }
    rem = this.findById(this.element, id, "removal");
    if (rem === null) {
      return;
    }
    needToActivateNewTab = rem.hasClass('tab-active');
    if (trigger) {
      this.element.trigger('tabclose', [rem.attr('tabid')]);
    }
    return rem.animate({
      'width': '0'
    }, function() {
      rem.remove();
      if (needToActivateNewTab) {
        return _this.activateTabById(_this.element.find('li:first').attr('tabid'));
      }
    });
  };

  TouchTabs.prototype.findById = function(element, id, operation) {
    var tab;
    tab = element.find("[tabid=" + id + "]");
    if (tab.length === 0) {
      throw "Error: Could not select tab with tabid:\"" + id + "\". Failed attempted " + operation;
      return null;
    } else {
      return tab;
    }
  };

  TouchTabs.prototype.move = function(Xpos) {
    var active_tab, atEnd, ind, offset, rel_position, tabh, tabheaders, _i, _len;
    offset = Xpos - this.initMouseX;
    if (this.drag15px !== true && Math.abs(offset) < 16) {
      return;
    }
    this.drag15px = true;
    tabheaders = this.element.find('li');
    active_tab = this.element.find('.tab-active');
    ind = -1;
    for (_i = 0, _len = tabheaders.length; _i < _len; _i++) {
      tabh = tabheaders[_i];
      if ($(tabh).is(active_tab)) {
        ind = _i;
      }
    }
    atEnd = ind === tabheaders.length - 1;
    if (offset < 0 && ind === 0) {
      offset = 0;
    }
    rel_position = Math.round(offset / this.tabWidth);
    if (atEnd && rel_position > 0) {
      rel_position = 0;
    }
    if (rel_position !== 0) {
      if (rel_position > 0) {
        this.element.find('.tab-active').insertAfter(tabheaders[ind + rel_position]);
      }
      if (rel_position < 0) {
        this.element.find('.tab-active').insertBefore(tabheaders[ind + rel_position]);
      }
      if (ind + rel_position >= 0 || ind + rel_position <= tabheaders.length) {
        this.initMouseX += this.tabWidth * rel_position;
      }
    }
    if (offset !== 0) {
      offset = Xpos - this.initMouseX;
    }
    this.element.find('.tab-active:first').stop();
    return this.element.find('.tab-active:first').css({
      'left': offset + 'px'
    });
  };

  return TouchTabs;

})();
