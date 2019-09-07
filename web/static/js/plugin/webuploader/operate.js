/*
picBox：图片容器
k：		容器index
picNum：上传图片数量
picW：	缩略图宽度
picH：	缩略图高度
*/
function BulkAdd(picBox,k,picNum,picW,picH){
	var $=jQuery;    // just in case. Make sure it's not an other libaray.
	var picTem ='\
		<div class="uploader com_picUploader" id="uploader'+k+'">\
			<div class="queueList" id="queue'+k+'">\
				<div class="placeholder" >\
					<div class="filePicker" id="addPic'+k+'"></div>\
				</div>\
			</div>\
			<div class="statusBar" style="display:none;">\
				<div class="progress"style="display:none;">\
					<span class="text">0%</span>\
					<span class="percentage"></span>\
				</div>\
				<div class="info" style="display:none;"></div>\
				<div class="btns">\
					<div class="filePicker2" id="againAdd'+k+'"></div>\
					<div class="uploadBtn">开始上传</div>\
				</div>\
			</div>\
		</div>\
		<input type="hidden" name="placeAvatar" class="checkPic validate" value="">';
	$(picBox).append(picTem);
	var $wrap=$('#uploader'+k),

		// 图片容器
		$queue=$('<ul class="filelist"></ul>').appendTo($wrap.find('.queueList')),

		// 状态栏，包括进度和控制按钮
		$statusBar=$wrap.find('.statusBar'),

		// 文件总体选择信息。
		$info=$statusBar.find('.info'),

		// 上传按钮
		$upload=$wrap.find('.uploadBtn'),

		// 没选择文件之前的内容。
		$placeHolder=$wrap.find('.placeholder'),

		// 总体进度条
		$progress=$statusBar.find('.progress').hide(),

		// 添加的文件数量
		fileCount=0,

		// 添加的文件总大小
		fileSize=0,

		// 优化retina, 在retina下这个值是2
		ratio=window.devicePixelRatio || 1,

		// 可能有pedding, ready, uploading, confirm, done.
		state='pedding',

		// 所有文件的进度信息，key为file id
		percentages ={},

		supportTransition=(function(){
			var s=document.createElement('p').style,
				r='transition' in s ||
					'WebkitTransition' in s ||
					'MozTransition' in s ||
					'msTransition' in s ||
					'OTransition' in s;
			s=null;
			return r;
		})(),

		// WebUploader实例
		uploader;

		// 缩略图大小
		if(picW!=undefined){
			var thumbnailWidth=picW * ratio;
		}else{
			var thumbnailWidth=160 * ratio;
		}
		if(picH!=undefined){
			var thumbnailHeight=picH * ratio;
		}else{
			var thumbnailHeight=115 * ratio;
		}

		$(document).on("click",".uploader .statusBar .btns",function(){
			$(this).closest('.opcon').find('.missTip').remove();
		});

	if (!WebUploader.Uploader.support()){
		alert('Web Uploader 不支持您的浏览器！如果你使用的是IE浏览器，请尝试升级 flash 播放器');
		throw new Error('WebUploader does not support the browser you are using.');
	}

	//判断是否自动上传
	if(picNum>1){
		var currAuto=false;
	}else{
		var currAuto=true;
	}

	// 实例化
	uploader=WebUploader.create({
		pick:{
			id: '#addPic'+k,
			label: '选择图片'
		},
		dnd: '#queue'+k,
		paste: document.body,
		auto:currAuto,

		accept:{
			title: 'Images',
			extensions: 'gif,jpg,jpeg,bmp,png',
			mimeTypes: 'image/gif,image/jpg,image/jpeg,image/bmp,image/png'
		},

		// swf文件路径
		swf: 'Uploader.swf',
		disableGlobalDnd: true,
		chunked: true,
		server: '/upload/picture',
		fileNumLimit: picNum,
		fileSizeLimit: 50 * 1024 * 1024,    // 50 M
		fileSingleSizeLimit: 5 * 1024 * 1024    // 5 M
	});

	if(picNum>1){
		// 添加“添加文件”的按钮，
		uploader.addButton({
			id: '#againAdd'+k,
			label: '继续添加'
		});
	}

	// 当有文件添加进来时执行，负责view的创建
	function addFile(file){
		var $li=$('<li id="'+file.id+'">' +
				'<div class="upAvatar"><p class="imgWrap"></p></div>'+
				'<p class="progress"><span></span></p>' +
				'</li>'),

			$btns=$('<div class="file-panel"><span class="cancel"><i></i>取消</span></div>').appendTo($li),
			$prgress=$li.find('p.progress span'),
			$wrap=$li.find('p.imgWrap'),
			$info=$('<p class="error"></p>'),

			showError=function(code){
				switch(code){
					case 'exceed_size':
					text='文件大小超出';
					break;
					case 'interrupt':
					text='上传暂停';
					break;
					default:
					text='上传失败，请<a href="javascript:;" class="retry" style="color:#fff;">重试</a>';
					break;
				}
				$info.html(text).appendTo($li);
			};
		if (file.getStatus() === 'invalid'){
			showError(file.statusText);
		}else{
			// @todo lazyload
			$wrap.text('预览中');
			uploader.makeThumb(file, function(error, src){
				if (error){
					$wrap.text('不能预览');
					return;
				}

				var img=$('<img src="'+src+'">');
				$wrap.empty().append(img);
			}, thumbnailWidth, thumbnailHeight);

			percentages[file.id]=[file.size, 0];
			file.rotation=0;
		}

		file.on('statuschange', function(cur, prev){
			if (prev === 'progress'){
				$prgress.hide().width(0);
			}else if (prev === 'queued'){
				$li.off('mouseenter mouseleave');
				//$btns.remove();
			}

			// 成功
			if (cur === 'error' || cur === 'invalid'){
				//console.log(file.statusText);
				showError(file.statusText);
				percentages[file.id][1]=1;
			}else if (cur === 'interrupt'){
				showError('interrupt');
			}else if (cur === 'queued'){
				percentages[file.id][1]=0;
			}else if (cur === 'progress'){
				//$info.remove();
				$prgress.css('display', 'block');
			}else if (cur === 'complete'){
				$li.append('<span class="success"></span><a href="javascript:;" class="imgDel"></a>');
			}

			$li.removeClass('state-'+prev).addClass('state-'+cur);
		});

		//取消，重新选择
		$btns.on('click', 'span', function(){
			uploader.removeFile(file);
			return;
		});

		//重试
		$info.on('click','.retry',function(){
			uploader.retry();
		});

		$li.appendTo($queue);
	}

	// 负责view的销毁
	function removeFile(file){
		var $li=$('#'+file.id);

		delete percentages[file.id];
		updateTotalProgress();
		$li.off().find('.file-panel').off().end().remove();
	}

	function updateTotalProgress(){
		var loaded=0,
			total=0,
			spans=$progress.children(),
			percent;

		$.each(percentages, function(k, v){
			total += v[0];
			loaded += v[0] * v[1];
		});

		percent=total ? loaded / total : 0;

		spans.eq(0).text(Math.round(percent * 100)+'%');
		spans.eq(1).css('width', Math.round(percent * 100)+'%');
		updateStatus();
	}

	function updateStatus(){
		var text='', stats;

		if (state === 'ready'){
			text='选中'+fileCount+'张图片，共' +
					WebUploader.formatSize(fileSize)+'。';
		}else if (state === 'confirm'){
			stats=uploader.getStats();
			if (stats.uploadFailNum){
				text='已成功上传'+stats.successNum+ '张照片至XX相册，'+
					stats.uploadFailNum+'张照片上传失败，<a class="retry" href="#">重新上传</a>失败图片'
			}

		}else{
			stats=uploader.getStats();
			text='共'+fileCount+'张（' +
					WebUploader.formatSize(fileSize)  +
					'），已上传'+stats.successNum+'张';

			if (stats.uploadFailNum){
				text += '，失败'+stats.uploadFailNum+'张';
			}
		}

		$info.html(text);
	}

	function setState(val){
		var file, stats;

		if (val === state){
			return;
		}

		$upload.removeClass('state-'+state);
		$upload.addClass('state-'+val);
		state=val;

		switch (state){
			case 'pedding':
				$placeHolder.removeClass('element-invisible');
				$queue.parent().removeClass('filled');
				$queue.hide();
				$statusBar.addClass('element-invisible');
				uploader.refresh();
				break;

			case 'ready':
				$placeHolder.addClass('element-invisible');
				$('#againAdd'+k).removeClass('element-invisible');
				$queue.parent().addClass('filled');
				$queue.show();
				$statusBar.removeClass('element-invisible');
				uploader.refresh();
				break;

			case 'uploading':
				// $('#againAdd'+k).addClass('element-invisible');
				// $progress.show();
				$upload.text('暂停上传');
				break;

			case 'paused':
				// $progress.show();
				$upload.text('继续上传');
				break;

			case 'confirm':
				$progress.hide();
				$upload.text('开始上传');
				if(picNum<2){
					$upload.addClass('disabled');
				}

				stats=uploader.getStats();
				if (stats.successNum && !stats.uploadFailNum){
					setState('finish');
					return;
				}
				break;
			case 'finish':
				stats=uploader.getStats();
				if (stats.successNum){
					// console.log('上传成功');
				}else{
					// 没有成功的图片，重设
					state='done';
					location.reload();
				}
				break;
		}

		updateStatus();
	}

	// 上传过程中触发，携带上传进度
	uploader.onUploadProgress=function(file, percentage){
		var $li=$('#'+file.id),
			$percent=$li.find('.progress span');

		$percent.css('width', percentage * 100+'%');
		percentages[file.id][1]=percentage;
		updateTotalProgress();
	};

	// 当文件上传成功时触发
	uploader.onUploadSuccess=function(file,res){
		handlerRes(res);
		if(res.code==2){
			$('#'+file.id).find('.txt').attr('path',res.data);
			$('input[name="placeAvatar"]').val(res.data);
		}
	};

	//当文件被加入队列以后触发
	uploader.onFileQueued=function(file){
		fileCount++;
		fileSize += file.size;

		if (fileCount === 1){
			$placeHolder.addClass('element-invisible');
			//当需上传多张图时显示statusBar
			if(picNum>1){
				$statusBar.show();
			}
		}

		addFile(file);
		setState('ready');
		updateTotalProgress();
	};

	// 当文件被移除队列后触发
	uploader.onFileDequeued=function(file){
		fileCount--;
		fileSize -= file.size;

		if (!fileCount){
			setState('pedding');
		}
		removeFile(file);
		updateTotalProgress();

	};

	uploader.on('all', function(type){
		var stats;
		switch(type){
			case 'uploadFinished':
				setState('confirm');
				break;

			case 'startUpload':
				setState('uploading');
				break;

			case 'stopUpload':
				setState('paused');
				break;

		}
	});

	//派送错误事件
	uploader.onError=function(code){
		alert('温馨提示: '+code);
	};

	$upload.on('click', function(){
		if ($(this).hasClass('disabled')){
			return false;
		}

		if (state === 'ready'){
			uploader.upload();
		}else if (state === 'paused'){
			uploader.upload();
		}else if (state === 'uploading'){
			uploader.stop();
		}
	});

	$upload.addClass('state-'+state);
	updateTotalProgress();
};