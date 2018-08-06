app.directive("upLoad",function ($http,$rootScope,uploadService) {
    return {
        restrict: "EA",
        replace: true,
        scope: {
            fileId: "@",
            previewId: "@",
            imageSrc: "="
        },
        templateUrl: "js/directives/upload/upLoad.html",
        link: function (scope,element,attr) {
            scope.isShow = false;  // 默认隐藏上传信息，当点击选择文件后显示

            // 选择文件按钮
            scope.fileChanged = function (ele) {
                scope.$apply(function () {
                    scope.files = ele.files[0]; // 保存要上传的图片信息到files
                    scope.fileName = ele.files[0].name;  // 图片名字
                    scope.fileSize = ele.files[0].size;  // 图片大小
                    scope.input = ele;
                    scope.isShow = true;
                })
            }
            // 上传图片
            scope.upload = function () {
                var formData = new FormData();  // 创建FormData的实例，用来存放要上传的参数
                var fileReader = new FileReader();  // 创建一个FileReader实例
                fileReader.onprogress = function (ev) {  // 读取中会触发这个事件
                    scope.progress = Math.round(ev.lengthComputable ? ev.loaded * 100 / ev.total : 0);  // 进度条,已读取大小除以图片大小
                }
                if (scope.fileSize <= 5242880) { // 限制上传大于5MB的文件
                    fileReader.readAsArrayBuffer(scope.files); // 用于启动读取指定的scope.files内容,并触发事件,否者无法触发progress事件
                    formData.append("file",scope.files); // 要上传的参数以键值对的形式存入到formData
                    uploadService.upload(formData).then(function (res) {
                        if (res.data.code == 0) {
                            scope.okIcon = true;
                            scope.imageSrc = res.data.fileName;
                        } else {
                            scope.progress = 0;
                            scope.removeIcon = true; //  上传失败显示X
                            $rootScope.alert(res.data.message);
                        }
                    },function (reason) {
                        scope.progress = 0;
                        scope.removeIcon = true;
                        $rootScope.alert("上传失败");
                    })
                } else {
                    $rootScope.alert("不能上传大于5MB的文件");
                }
            }
            // 删除按钮
            scope.delete = function () {
                scope.removeIcon = false;
                scope.isShow = false;
                scope.okIcon = false;
                scope.progress = 0;
                scope.imageSrc = undefined;
                scope.input.value = "";  // 防止删除一个文件后不能再次上传同一个文件的问题
                $("#"+ scope.previewId).attr("src","");  // 删除预览图
            }
        }
    }
})