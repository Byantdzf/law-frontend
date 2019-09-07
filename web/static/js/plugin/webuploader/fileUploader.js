/*
plugName：   文件上传
fileBoxIndex 容器Index
fileNum：    上传的文件数量
format：     文件格式
*/
function fileUpload(fileBoxIndex,fileNum,format){
	var containBox=$('#affixBox'+fileBoxIndex),
		fileList=containBox.find('.affixList'),
		upBtn=containBox.find('.uploadBtn');

	var fileUploader = WebUploader.create({

		// swf文件路径
		swf:'/static/js/plugs/webuploader/Uploader.swf',

		// 文件接收服务端。
		server: '/upload/picture',

		accept: {   //文件格式
			extensions: format
			//mimeTypes:'application/'+format
		},

		fileNumLimit: fileNum,    //添加文件数量
		fileSizeLimit: 100 * 1024 * 1024,    // 一次最大上传100 M
		fileSingleSizeLimit: 50 * 1024 * 1024,    // 单个文件最大50 M

		// 选择文件的按钮。可选。
		pick: {
			id: '#picker'+fileBoxIndex
		},

		// 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
		resize: false
	});

	// 当有文件被添加进队列的时候
	fileUploader.on('fileQueued',function(file) {
		fileList.append(
		'<div id="'+file.id+'" class="item rel" style="margin-bottom:10px;">'+
			'<input type="text" class="inpText mr10" name="fileName" value="'+file.name+'"/>'+
			'<span class="state"></span>'+
			'<p class="progress"><span></span></p>' +
			'<a href="javascript:;" class="del" style="color:#f00; margin-left:20px">删除</a>' +
			'<input type="hidden" name="filePath" />'+
		'</div>');

		if(fileList.find('.item').length==fileNum){
			$(containBox).find('.picker').hide();   //隐藏选择文件按钮
		}
		upBtn.show();   //显示开始上传按钮

		//从队列中移除
		fileList.find('.del').on("click",function(){
			fileUploader.removeFile(fileUploader.getFile(file.id));
			$(this).closest('.item').remove();
			$(containBox).find('.picker').show();
			upBtn.hide();
		});

	});

	//上传进度
	fileUploader.on( 'uploadProgress', function( file, percentage ) {
		var $li = $( '#'+file.id ),
			$percent = $li.find('.progress .progress-bar');

		// 避免重复创建
		if ( !$percent.length ) {
			$percent = $('<div class="progress progress-striped active">' +
			  '<div class="progress-bar" role="progressbar" style="width: 0%">' +
			  '</div>' +
			'</div>').appendTo( $li ).find('.progress-bar');
		}
		$li.find('.state').text('上传中');
		$li.find('.progress span').css({display:"block",width:"173px"});
		$percent.css( 'width', percentage * 100 + '%' );
	});

	//上传成功
	fileUploader.on( 'uploadSuccess', function( file,res ) {
		handlerRes(res);
		if(res.code==2){
			$('#'+file.id).find('.state').text('已上传');
			$('#'+file.id).find('.progress span').css({display:"none",width:"173px"});
			$('#'+file.id).find('input[name="filePath"]').val(res.data);
			$('input[name="fileTxt"]').val(res.data);
		}
	});

	//上传出错
	fileUploader.on( 'uploadError', function( file ) {
		$( '#'+file.id ).find('.state').text('上传出错');
	});

	//上传完成隐藏进度条
	fileUploader.on( 'uploadComplete', function( file ) {
		$( '#'+file.id ).find('.progress').fadeOut();
	});

	//点击上传按钮
	upBtn.on('click', function() {
	   fileUploader.upload();
	});
}