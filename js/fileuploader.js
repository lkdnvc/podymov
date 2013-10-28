var qq = qq || {};
qq.extend = function (e, t) {
    for (var n in t) {
        e[n] = t[n]
    }
};
qq.indexOf = function (e, t, n) {
    if (e.indexOf)return e.indexOf(t, n);
    n = n || 0;
    var r = e.length;
    if (n < 0)n += r;
    for (; n < r; n++) {
        if (n in e && e[n] === t) {
            return n
        }
    }
    return-1
};
qq.getUniqueId = function () {
    var e = 0;
    return function () {
        return e++
    }
}();
qq.attach = function (e, t, n) {
    if (e.addEventListener) {
        e.addEventListener(t, n, false)
    } else if (e.attachEvent) {
        e.attachEvent("on" + t, n)
    }
};
qq.detach = function (e, t, n) {
    if (e.removeEventListener) {
        e.removeEventListener(t, n, false)
    } else if (e.attachEvent) {
        e.detachEvent("on" + t, n)
    }
};
qq.preventDefault = function (e) {
    if (e.preventDefault) {
        e.preventDefault()
    } else {
        e.returnValue = false
    }
};
qq.insertBefore = function (e, t) {
    t.parentNode.insertBefore(e, t)
};
qq.remove = function (e) {
    e.parentNode.removeChild(e)
};
qq.contains = function (e, t) {
    if (e == t)return true;
    if (e.contains) {
        return e.contains(t)
    } else {
        return!!(t.compareDocumentPosition(e) & 8)
    }
};
qq.toElement = function () {
    var e = document.createElement("div");
    return function (t) {
        e.innerHTML = t;
        var n = e.firstChild;
        e.removeChild(n);
        return n
    }
}();
qq.css = function (e, t) {
    if (t.opacity != null) {
        if (typeof e.style.opacity != "string" && typeof e.filters != "undefined") {
            t.filter = "alpha(opacity=" + Math.round(100 * t.opacity) + ")"
        }
    }
    qq.extend(e.style, t)
};
qq.hasClass = function (e, t) {
    var n = new RegExp("(^| )" + t + "( |$)");
    return n.test(e.className)
};
qq.addClass = function (e, t) {
    if (!qq.hasClass(e, t)) {
        e.className += " " + t
    }
};
qq.removeClass = function (e, t) {
    var n = new RegExp("(^| )" + t + "( |$)");
    e.className = e.className.replace(n, " ").replace(/^\s+|\s+$/g, "")
};
qq.setText = function (e, t) {
    e.innerText = t;
    e.textContent = t
};
qq.children = function (e) {
    var t = [], n = e.firstChild;
    while (n) {
        if (n.nodeType == 1) {
            t.push(n)
        }
        n = n.nextSibling
    }
    return t
};
qq.getByClass = function (e, t) {
    if (e.querySelectorAll) {
        return e.querySelectorAll("." + t)
    }
    var n = [];
    var r = e.getElementsByTagName("*");
    var i = r.length;
    for (var s = 0; s < i; s++) {
        if (qq.hasClass(r[s], t)) {
            n.push(r[s])
        }
    }
    return n
};
qq.obj2url = function (e, t, n) {
    var r = [], i = "&", s = function (e, n) {
        var i = t ? /\[\]$/.test(t) ? t : t + "[" + n + "]" : n;
        if (i != "undefined" && n != "undefined") {
            r.push(typeof e === "object" ? qq.obj2url(e, i, true) : Object.prototype.toString.call(e) === "[object Function]" ? encodeURIComponent(i) + "=" + encodeURIComponent(e()) : encodeURIComponent(i) + "=" + encodeURIComponent(e))
        }
    };
    if (!n && t) {
        i = /\?/.test(t) ? /\?$/.test(t) ? "" : "&" : "?";
        r.push(t);
        r.push(qq.obj2url(e))
    } else if (Object.prototype.toString.call(e) === "[object Array]" && typeof e != "undefined") {
        for (var o = 0, u = e.length; o < u; ++o) {
            s(e[o], o)
        }
    } else if (typeof e != "undefined" && e !== null && typeof e === "object") {
        for (var o in e) {
            s(e[o], o)
        }
    } else {
        r.push(encodeURIComponent(t) + "=" + encodeURIComponent(e))
    }
    return r.join(i).replace(/^&/, "").replace(/%20/g, "+")
};
var qq = qq || {};
qq.FileUploaderBasic = function (e) {
    this._options = {debug: false, action: "/server/upload", params: {}, button: null, multiple: true, maxConnections: 3, allowedExtensions: [], sizeLimit: 0, minSizeLimit: 0, onSubmit: function (e, t) {
    }, onProgress: function (e, t, n, r) {
    }, onComplete: function (e, t, n) {
    }, onCancel: function (e, t) {
    }, messages: {typeError: "{file} has invalid extension. Only {extensions} are allowed.", sizeError: "{file} is too large, maximum file size is {sizeLimit}.", minSizeError: "{file} is too small, minimum file size is {minSizeLimit}.", emptyError: "{file} is empty, please select files again without it.", onLeave: "The files are being uploaded, if you leave now the upload will be cancelled."}, showMessage: function (e) {
        alert(e)
    }};
    qq.extend(this._options, e);
    this._filesInProgress = 0;
    this._handler = this._createUploadHandler();
    if (this._options.button) {
        this._button = this._createUploadButton(this._options.button)
    }
    this._preventLeaveInProgress()
};
qq.FileUploaderBasic.prototype = {setParams: function (e) {
    this._options.params = e
}, getInProgress: function () {
    return this._filesInProgress
}, _createUploadButton: function (e) {
    var t = this;
    return new qq.UploadButton({element: e, multiple: this._options.multiple && qq.UploadHandlerXhr.isSupported(), onChange: function (e) {
        t._onInputChange(e)
    }})
}, _createUploadHandler: function () {
    var e = this, t;
    if (qq.UploadHandlerXhr.isSupported()) {
        t = "UploadHandlerXhr"
    } else {
        t = "UploadHandlerForm"
    }
    var n = new qq[t]({debug: this._options.debug, action: this._options.action, maxConnections: this._options.maxConnections, onProgress: function (t, n, r, i) {
        e._onProgress(t, n, r, i);
        e._options.onProgress(t, n, r, i)
    }, onComplete: function (t, n, r) {
        e._onComplete(t, n, r);
        e._options.onComplete(t, n, r)
    }, onCancel: function (t, n) {
        e._onCancel(t, n);
        e._options.onCancel(t, n)
    }});
    return n
}, _preventLeaveInProgress: function () {
    var e = this;
    qq.attach(window, "beforeunload", function (t) {
        if (!e._filesInProgress) {
            return
        }
        var t = t || window.event;
        t.returnValue = e._options.messages.onLeave;
        return e._options.messages.onLeave
    })
}, _onSubmit: function (e, t) {
    this._filesInProgress++
}, _onProgress: function (e, t, n, r) {
}, _onComplete: function (e, t, n) {
    this._filesInProgress--;
    if (n.error) {
        this._options.showMessage(n.error)
    }
}, _onCancel: function (e, t) {
    this._filesInProgress--
}, _onInputChange: function (e) {
    if (this._handler instanceof qq.UploadHandlerXhr) {
        this._uploadFileList(e.files)
    } else {
        if (this._validateFile(e)) {
            this._uploadFile(e)
        }
    }
    this._button.reset()
}, _uploadFileList: function (e) {
    for (var t = 0; t < e.length; t++) {
        if (!this._validateFile(e[t])) {
            return
        }
    }
    for (var t = 0; t < e.length; t++) {
        this._uploadFile(e[t])
    }
}, _uploadFile: function (e) {
    var t = this._handler.add(e);
    var n = this._handler.getName(t);
    if (this._options.onSubmit(t, n) !== false) {
        this._onSubmit(t, n);
        this._handler.upload(t, this._options.params)
    }
}, _validateFile: function (e) {
    var t, n;
    if (e.value) {
        t = e.value.replace(/.*(\/|\\)/, "")
    } else {
        t = e.fileName != null ? e.fileName : e.name;
        n = e.fileSize != null ? e.fileSize : e.size
    }
    if (!this._isAllowedExtension(t)) {
        this._error("typeError", t);
        return false
    } else if (n === 0) {
        this._error("emptyError", t);
        return false
    } else if (n && this._options.sizeLimit && n > this._options.sizeLimit) {
        this._error("sizeError", t);
        return false
    } else if (n && n < this._options.minSizeLimit) {
        this._error("minSizeError", t);
        return false
    }
    return true
}, _error: function (e, t) {
    function r(e, t) {
        n = n.replace(e, t)
    }

    var n = this._options.messages[e];
    r("{file}", this._formatFileName(t));
    r("{extensions}", this._options.allowedExtensions.join(", "));
    r("{sizeLimit}", this._formatSize(this._options.sizeLimit));
    r("{minSizeLimit}", this._formatSize(this._options.minSizeLimit));
    this._options.showMessage(n)
}, _formatFileName: function (e) {
    if (e.length > 33) {
        e = e.slice(0, 19) + "..." + e.slice(-13)
    }
    return e
}, _isAllowedExtension: function (e) {
    var t = -1 !== e.indexOf(".") ? e.replace(/.*[.]/, "").toLowerCase() : "";
    var n = this._options.allowedExtensions;
    if (!n.length) {
        return true
    }
    for (var r = 0; r < n.length; r++) {
        if (n[r].toLowerCase() == t) {
            return true
        }
    }
    return false
}, _formatSize: function (e) {
    var t = -1;
    do {
        e = e / 1024;
        t++
    } while (e > 99);
    return Math.max(e, .1).toFixed(1) + ["kB", "MB", "GB", "TB", "PB", "EB"][t]
}};
qq.FileUploader = function (e) {
    qq.FileUploaderBasic.apply(this, arguments);
    qq.extend(this._options, {element: null, listElement: null, template: '<div class="qq-uploader">' + '<div class="qq-upload-drop-area"><span>Drop files here to upload</span></div>' + '<div class="qq-upload-button"><span class="zagruzit btn btn-primary btn-lg" >Загрузить</span></div>' + '<ul class="qq-upload-list"></ul>' + "</div>", fileTemplate: "<li>" + '<span class="qq-upload-file"></span>' + '<span class="qq-upload-spinner"></span>' + '<span class="qq-upload-size"></span>' + '<a class="qq-upload-cancel" href="#">Cancel</a>' + '<span class="qq-upload-failed-text">Failed</span>' + "</li>", classes: {button: "qq-upload-button", drop: "qq-upload-drop-area", dropActive: "qq-upload-drop-area-active", list: "qq-upload-list", file: "qq-upload-file", spinner: "qq-upload-spinner", size: "qq-upload-size", cancel: "qq-upload-cancel", success: "qq-upload-success", fail: "qq-upload-fail"}});
    qq.extend(this._options, e);
    this._element = this._options.element;
    this._element.innerHTML = this._options.template;
    this._listElement = this._options.listElement || this._find(this._element, "list");
    this._classes = this._options.classes;
    this._button = this._createUploadButton(this._find(this._element, "button"));
    this._bindCancelEvent();
    this._setupDragDrop()
};
qq.extend(qq.FileUploader.prototype, qq.FileUploaderBasic.prototype);
qq.extend(qq.FileUploader.prototype, {_find: function (e, t) {
    var n = qq.getByClass(e, this._options.classes[t])[0];
    if (!n) {
        throw new Error("element not found " + t)
    }
    return n
}, _setupDragDrop: function () {
    var e = this, t = this._find(this._element, "drop");
    var n = new qq.UploadDropZone({element: t, onEnter: function (n) {
        qq.addClass(t, e._classes.dropActive);
        n.stopPropagation()
    }, onLeave: function (e) {
        e.stopPropagation()
    }, onLeaveNotDescendants: function (n) {
        qq.removeClass(t, e._classes.dropActive)
    }, onDrop: function (n) {
        t.style.display = "none";
        qq.removeClass(t, e._classes.dropActive);
        e._uploadFileList(n.dataTransfer.files)
    }});
    t.style.display = "none";
    qq.attach(document, "dragenter", function (e) {
        if (!n._isValidFileDrag(e))return;
        t.style.display = "block"
    });
    qq.attach(document, "dragleave", function (e) {
        if (!n._isValidFileDrag(e))return;
        var r = document.elementFromPoint(e.clientX, e.clientY);
        if (!r || r.nodeName == "HTML") {
            t.style.display = "none"
        }
    })
}, _onSubmit: function (e, t) {
    qq.FileUploaderBasic.prototype._onSubmit.apply(this, arguments);
    this._addToList(e, t)
}, _onProgress: function (e, t, n, r) {
    qq.FileUploaderBasic.prototype._onProgress.apply(this, arguments);
    var i = this._getItemByFileId(e);
    var s = this._find(i, "size");
    s.style.display = "inline";
    var o;
    if (n != r) {
        o = Math.round(n / r * 100) + "% from " + this._formatSize(r)
    } else {
        o = this._formatSize(r)
    }
    qq.setText(s, o)
}, _onComplete: function (e, t, n) {
    qq.FileUploaderBasic.prototype._onComplete.apply(this, arguments);
    var r = this._getItemByFileId(e);
    qq.remove(this._find(r, "cancel"));
    qq.remove(this._find(r, "spinner"));
    if (n.success) {
        qq.addClass(r, this._classes.success)
    } else {
        qq.addClass(r, this._classes.fail)
    }
}, _addToList: function (e, t) {
    var n = qq.toElement(this._options.fileTemplate);
    n.qqFileId = e;
    var r = this._find(n, "file");
    qq.setText(r, this._formatFileName(t));
    this._find(n, "size").style.display = "none";
    this._listElement.appendChild(n)
}, _getItemByFileId: function (e) {
    var t = this._listElement.firstChild;
    while (t) {
        if (t.qqFileId == e)return t;
        t = t.nextSibling
    }
}, _bindCancelEvent: function () {
    var e = this, t = this._listElement;
    qq.attach(t, "click", function (t) {
        t = t || window.event;
        var n = t.target || t.srcElement;
        if (qq.hasClass(n, e._classes.cancel)) {
            qq.preventDefault(t);
            var r = n.parentNode;
            e._handler.cancel(r.qqFileId);
            qq.remove(r)
        }
    })
}});
qq.UploadDropZone = function (e) {
    this._options = {element: null, onEnter: function (e) {
    }, onLeave: function (e) {
    }, onLeaveNotDescendants: function (e) {
    }, onDrop: function (e) {
    }};
    qq.extend(this._options, e);
    this._element = this._options.element;
    this._disableDropOutside();
    this._attachEvents()
};
qq.UploadDropZone.prototype = {_disableDropOutside: function (e) {
    if (!qq.UploadDropZone.dropOutsideDisabled) {
        qq.attach(document, "dragover", function (e) {
            if (e.dataTransfer) {
                e.dataTransfer.dropEffect = "none";
                e.preventDefault()
            }
        });
        qq.UploadDropZone.dropOutsideDisabled = true
    }
}, _attachEvents: function () {
    var e = this;
    qq.attach(e._element, "dragover", function (t) {
        if (!e._isValidFileDrag(t))return;
        var n = t.dataTransfer.effectAllowed;
        if (n == "move" || n == "linkMove") {
            t.dataTransfer.dropEffect = "move"
        } else {
            t.dataTransfer.dropEffect = "copy"
        }
        t.stopPropagation();
        t.preventDefault()
    });
    qq.attach(e._element, "dragenter", function (t) {
        if (!e._isValidFileDrag(t))return;
        e._options.onEnter(t)
    });
    qq.attach(e._element, "dragleave", function (t) {
        if (!e._isValidFileDrag(t))return;
        e._options.onLeave(t);
        var n = document.elementFromPoint(t.clientX, t.clientY);
        if (qq.contains(this, n))return;
        e._options.onLeaveNotDescendants(t)
    });
    qq.attach(e._element, "drop", function (t) {
        if (!e._isValidFileDrag(t))return;
        t.preventDefault();
        e._options.onDrop(t)
    })
}, _isValidFileDrag: function (e) {
    var t = e.dataTransfer, n = navigator.userAgent.indexOf("AppleWebKit") > -1;
    return t && t.effectAllowed != "none" && (t.files || !n && t.types.contains && t.types.contains("Files"))
}};
qq.UploadButton = function (e) {
    this._options = {element: null, multiple: false, name: "file", onChange: function (e) {
    }, hoverClass: "qq-upload-button-hover", focusClass: "qq-upload-button-focus"};
    qq.extend(this._options, e);
    this._element = this._options.element;
    qq.css(this._element, {position: "relative", overflow: "hidden", direction: "ltr"});
    this._input = this._createInput()
};
qq.UploadButton.prototype = {getInput: function () {
    return this._input
}, reset: function () {
    if (this._input.parentNode) {
        qq.remove(this._input)
    }
    qq.removeClass(this._element, this._options.focusClass);
    this._input = this._createInput()
}, _createInput: function () {
    var e = document.createElement("input");
    if (this._options.multiple) {
        e.setAttribute("multiple", "multiple")
    }
    e.setAttribute("type", "file");
    e.setAttribute("name", this._options.name);
    qq.css(e, {position: "absolute", right: 0, top: 0, fontFamily: "Arial", fontSize: "118px", margin: 0, padding: 0, cursor: "pointer", opacity: 0});
    this._element.appendChild(e);
    var t = this;
    qq.attach(e, "change", function () {
        t._options.onChange(e)
    });
    qq.attach(e, "mouseover", function () {
        qq.addClass(t._element, t._options.hoverClass)
    });
    qq.attach(e, "mouseout", function () {
        qq.removeClass(t._element, t._options.hoverClass)
    });
    qq.attach(e, "focus", function () {
        qq.addClass(t._element, t._options.focusClass)
    });
    qq.attach(e, "blur", function () {
        qq.removeClass(t._element, t._options.focusClass)
    });
    if (window.attachEvent) {
        e.setAttribute("tabIndex", "-1")
    }
    return e
}};
qq.UploadHandlerAbstract = function (e) {
    this._options = {debug: false, action: "/upload.php", maxConnections: 999, onProgress: function (e, t, n, r) {
    }, onComplete: function (e, t, n) {
    }, onCancel: function (e, t) {
    }};
    qq.extend(this._options, e);
    this._queue = [];
    this._params = []
};
qq.UploadHandlerAbstract.prototype = {log: function (e) {
    if (this._options.debug && window.console)console.log("[uploader] " + e)
}, add: function (e) {
}, upload: function (e, t) {
    var n = this._queue.push(e);
    var r = {};
    qq.extend(r, t);
    this._params[e] = r;
    if (n <= this._options.maxConnections) {
        this._upload(e, this._params[e])
    }
}, cancel: function (e) {
    this._cancel(e);
    this._dequeue(e)
}, cancelAll: function () {
    for (var e = 0; e < this._queue.length; e++) {
        this._cancel(this._queue[e])
    }
    this._queue = []
}, getName: function (e) {
}, getSize: function (e) {
}, getQueue: function () {
    return this._queue
}, _upload: function (e) {
}, _cancel: function (e) {
}, _dequeue: function (e) {
    var t = qq.indexOf(this._queue, e);
    this._queue.splice(t, 1);
    var n = this._options.maxConnections;
    if (this._queue.length >= n && t < n) {
        var r = this._queue[n - 1];
        this._upload(r, this._params[r])
    }
}};
qq.UploadHandlerForm = function (e) {
    qq.UploadHandlerAbstract.apply(this, arguments);
    this._inputs = {}
};
qq.extend(qq.UploadHandlerForm.prototype, qq.UploadHandlerAbstract.prototype);
qq.extend(qq.UploadHandlerForm.prototype, {add: function (e) {
    e.setAttribute("name", "qqfile");
    var t = "qq-upload-handler-iframe" + qq.getUniqueId();
    this._inputs[t] = e;
    if (e.parentNode) {
        qq.remove(e)
    }
    return t
}, getName: function (e) {
    return this._inputs[e].value.replace(/.*(\/|\\)/, "")
}, _cancel: function (e) {
    this._options.onCancel(e, this.getName(e));
    delete this._inputs[e];
    var t = document.getElementById(e);
    if (t) {
        t.setAttribute("src", "javascript:false;");
        qq.remove(t)
    }
}, _upload: function (e, t) {
    var n = this._inputs[e];
    if (!n) {
        throw new Error("file with passed id was not added, or already uploaded or cancelled")
    }
    var r = this.getName(e);
    var i = this._createIframe(e);
    var s = this._createForm(i, t);
    s.appendChild(n);
    var o = this;
    this._attachLoadEvent(i, function () {
        o.log("iframe loaded");
        var t = o._getIframeContentJSON(i);
        o._options.onComplete(e, r, t);
        o._dequeue(e);
        delete o._inputs[e];
        setTimeout(function () {
            qq.remove(i)
        }, 1)
    });
    s.submit();
    qq.remove(s);
    return e
}, _attachLoadEvent: function (e, t) {
    qq.attach(e, "load", function () {
        if (!e.parentNode) {
            return
        }
        if (e.contentDocument && e.contentDocument.body && e.contentDocument.body.innerHTML == "false") {
            return
        }
        t()
    })
}, _getIframeContentJSON: function (iframe) {
    var doc = iframe.contentDocument ? iframe.contentDocument : iframe.contentWindow.document, response;
    this.log("converting iframe's innerHTML to JSON");
    this.log("innerHTML = " + doc.body.innerHTML);
    try {
        response = eval("(" + doc.body.innerHTML + ")")
    } catch (err) {
        response = {}
    }
    return response
}, _createIframe: function (e) {
    var t = qq.toElement('<iframe src="javascript:false;" name="' + e + '" />');
    t.setAttribute("id", e);
    t.style.display = "none";
    document.body.appendChild(t);
    return t
}, _createForm: function (e, t) {
    var n = qq.toElement('<form method="post" enctype="multipart/form-data"></form>');
    var r = qq.obj2url(t, this._options.action);
    n.setAttribute("action", r);
    n.setAttribute("target", e.name);
    n.style.display = "none";
    document.body.appendChild(n);
    return n
}});
qq.UploadHandlerXhr = function (e) {
    qq.UploadHandlerAbstract.apply(this, arguments);
    this._files = [];
    this._xhrs = [];
    this._loaded = []
};
qq.UploadHandlerXhr.isSupported = function () {
    var e = document.createElement("input");
    e.type = "file";
    return"multiple"in e && typeof File != "undefined" && typeof (new XMLHttpRequest).upload != "undefined"
};
qq.extend(qq.UploadHandlerXhr.prototype, qq.UploadHandlerAbstract.prototype);
qq.extend(qq.UploadHandlerXhr.prototype, {add: function (e) {
    if (!(e instanceof File)) {
        throw new Error("Passed obj in not a File (in qq.UploadHandlerXhr)")
    }
    return this._files.push(e) - 1
}, getName: function (e) {
    var t = this._files[e];
    return t.fileName != null ? t.fileName : t.name
}, getSize: function (e) {
    var t = this._files[e];
    return t.fileSize != null ? t.fileSize : t.size
}, getLoaded: function (e) {
    return this._loaded[e] || 0
}, _upload: function (e, t) {
    var n = this._files[e], r = this.getName(e), i = this.getSize(e);
    this._loaded[e] = 0;
    var s = this._xhrs[e] = new XMLHttpRequest;
    var o = this;
    s.upload.onprogress = function (t) {
        if (t.lengthComputable) {
            o._loaded[e] = t.loaded;
            o._options.onProgress(e, r, t.loaded, t.total)
        }
    };
    s.onreadystatechange = function () {
        if (s.readyState == 4) {
            o._onComplete(e, s)
        }
    };
    t = t || {};
    t["qqfile"] = r;
    var u = qq.obj2url(t, this._options.action);
    s.open("POST", u, true);
    s.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    s.setRequestHeader("X-File-Name", encodeURIComponent(r));
    s.setRequestHeader("Content-Type", "application/octet-stream");
    s.send(n)
}, _onComplete: function (id, xhr) {
    if (!this._files[id])return;
    var name = this.getName(id);
    var size = this.getSize(id);
    this._options.onProgress(id, name, size, size);
    if (xhr.status == 200) {
        this.log("xhr - server response received");
        this.log("responseText = " + xhr.responseText);
        var response;
        try {
            response = eval("(" + xhr.responseText + ")")
        } catch (err) {
            response = {}
        }
        this._options.onComplete(id, name, response)
    } else {
        this._options.onComplete(id, name, {})
    }
    this._files[id] = null;
    this._xhrs[id] = null;
    this._dequeue(id)
}, _cancel: function (e) {
    this._options.onCancel(e, this.getName(e));
    this._files[e] = null;
    if (this._xhrs[e]) {
        this._xhrs[e].abort();
        this._xhrs[e] = null
    }
}})