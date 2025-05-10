'use strict';

/**
 * File modal view controller.
 */
angular.module('docs').controller('FileModalView', function ($uibModalInstance, $scope, $state, $stateParams, $sce, Restangular, $transitions,$timeout) {
  var setFile = function (files) {
    // Search current file
    _.each(files, function (value) {
      if (value.id === $stateParams.fileId) {
        $scope.file = value;
        $scope.trustedFileUrl = $sce.trustAsResourceUrl('../api/file/' + $stateParams.fileId + '/data');
      }
    });
  };

  // Load files
  Restangular.one('file/list').get({ id: $stateParams.id }).then(function (data) {
    $scope.files = data.files;
    setFile(data.files);

    // File not found, maybe it's a version
    if (!$scope.file) {
      Restangular.one('file/' + $stateParams.fileId + '/versions').get().then(function (data) {
        setFile(data.files);
      });
    }
  });

  /**
   * Return the next file.
   */
  $scope.nextFile = function () {
    var next = undefined;
    _.each($scope.files, function (value, key) {
      if (value.id === $stateParams.fileId) {
        next = $scope.files[key + 1];
      }
    });
    return next;
  };

  /**
   * Return the previous file.
   */
  $scope.previousFile = function () {
    var previous = undefined;
    _.each($scope.files, function (value, key) {
      if (value.id === $stateParams.fileId) {
        previous = $scope.files[key - 1];
      }
    });
    return previous;
  };

  /**
   * Navigate to the next file.
   */
  $scope.goNextFile = function () {
    var next = $scope.nextFile();
    if (next) {
      $state.go('^.file', { id: $stateParams.id, fileId: next.id });
    }
  };

  /**
   * Navigate to the previous file.
   */
  $scope.goPreviousFile = function () {
    var previous = $scope.previousFile();
    if (previous) {
      $state.go('^.file', { id: $stateParams.id, fileId: previous.id });
    }
  };

  /**
   * Open the file in a new window.
   */
  $scope.openFile = function () {
    window.open('../api/file/' + $stateParams.fileId + '/data');
  };

  /**
   * Open the file content a new window.
   */
  $scope.openFileContent = function () {
    window.open('../api/file/' + $stateParams.fileId + '/data?size=content');
  };

  /**
   * Print the file.
   */
  $scope.printFile = function () {

    var popup = window.open('../api/file/' + $stateParams.fileId + '/data', '_blank');
    popup.onload = function () {
      popup.print();
      popup.close();
    }
  };
  /**
   * edit image.
   */
  $scope.openImageEditor = function () {
    $scope.editingImage = true;
    $scope.drawMode = true;

    $timeout(function ()  {
      const img = document.getElementById('previewImage');
      const canvas = document.getElementById('editorOverlayCanvas');
      const container = document.getElementById('imageEditorContainer');


      canvas.width = img.offsetWidth;
      canvas.height = img.offsetHeight;

      canvas.style.width = img.offsetWidth + 'px';
      canvas.style.height = img.offsetHeight + 'px';

      const ctx = canvas.getContext('2d');
      let drawing = false;

      canvas.onmousedown = function () {
        if ($scope.drawMode) drawing = true;
      };
      canvas.onmouseup = function () {
        drawing = false;
      };
      canvas.onmousemove = function (e) {
        if (!drawing) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fill();
      };
    }, 300); // 等图片加载完成
  };
  $scope.saveImageWithOverlay = function () {
    const img = document.getElementById('previewImage');
    const overlayCanvas = document.getElementById('editorOverlayCanvas');

    // 创建一个临时 canvas（用于合成）
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = overlayCanvas.width;
    finalCanvas.height = overlayCanvas.height;
    const ctx = finalCanvas.getContext('2d');


    const tempImage = new Image();
    tempImage.crossOrigin = 'anonymous';
    tempImage.onload = function () {
      //alert(tempImage)
      // 先画原图，再叠加标记层
      ctx.drawImage(tempImage, 0, 0, finalCanvas.width, finalCanvas.height);
      ctx.drawImage(overlayCanvas, 0, 0);

      //alert(finalCanvas.toDataURL('image/png'))
      // 生成下载链接
      const link = document.createElement('a');

      link.download = 'edited_image.png';
      link.href = finalCanvas.toDataURL('image/png');

      link.click();
    };


    tempImage.src = img.src;
  };

  // $scope.openImageEditor = function () {
  //   $scope.editingImage = true;
  //
  //   // 等待 AngularJS 把 canvas 加到 DOM 中
  //   $timeout(function () {
  //     const canvas = document.getElementById('editorCanvas');
  //     alert(canvas)
  //     // if (!canvas) {
  //     //   console.error('canvas not found');
  //     //   return;
  //     // }
  //     //
  //     // const ctx = canvas.getContext('2d');
  //     // // 设定 canvas 尺寸（如果需要）
  //     // canvas.width = 600;
  //     // canvas.height = 400;
  //     //
  //     // // 画图逻辑，比如填个背景
  //     // ctx.fillStyle = '#f5f5f5';
  //     // ctx.fillRect(0, 0, canvas.width, canvas.height);
  //     //
  //     // // 如果需要载入一张图片
  //     // const img = new Image();
  //     // img.onload = function () {
  //     //   ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  //     // };
  //     // img.src = $scope.fileUrl; // 你需要提前定义好 fileUrl，比如用 `$sce.trustAsResourceUrl(...)`
  //   }, 200); // 延迟 100ms 一般足够，必要时你可以调成 200ms
  // };


  // $scope.$watch('editingImage', function (enabled) {
  //   if (enabled) {
  //
  //     $timeout(function () {
  //       const canvas = document.getElementById('editorCanvas');
  //       if (!canvas) {
  //         console.error('editorCanvas not found');
  //         return;
  //       }
  //
  //       const ctx = canvas.getContext('2d');
  //       // 初始化 canvas...
  //     }, 100);
  //   };
  //     // const ctx = canvas.getContext('2d');
  //     // const img = new Image();
  //     // img.crossOrigin = 'anonymous';
  //     // img.onload = function () {
  //     //   canvas.width = img.width;
  //     //   canvas.height = img.height;
  //     //   ctx.drawImage(img, 0, 0);
  //     // };
  //     // img.src = '../api/file/' + $stateParams.fileId + '/data';
  //     //
  //     // // 简易画图功能
  //     // let drawing = false;
  //     // canvas.onmousedown = () => drawing = $scope.drawMode;
  //     // canvas.onmouseup = () => drawing = false;
  //     // canvas.onmousemove = function (e) {
  //     //   if (drawing) {
  //     //     ctx.fillStyle = "red";
  //     //     ctx.beginPath();
  //     //     ctx.arc(e.offsetX, e.offsetY, 5, 0, 2 * Math.PI);
  //     //     ctx.fill();
  //     //   }
  //     // };
  //   }
  // });

  /**
   * Close the file preview.
   */
  $scope.closeFile = function () {
    $uibModalInstance.dismiss();
  };

  // Close the modal when the user exits this state
  var off = $transitions.onStart({}, function(transition) {
    if (!$uibModalInstance.closed) {
      if (transition.to().name === $state.current.name) {
        $uibModalInstance.close();
      } else {
        $uibModalInstance.dismiss();
      }
    }
    off();
  });

  /**
   * Return true if we can display the preview image.
   */
  $scope.canDisplayPreview = function () {
    return $scope.file && $scope.file.mimetype !== 'application/pdf';
  };
});