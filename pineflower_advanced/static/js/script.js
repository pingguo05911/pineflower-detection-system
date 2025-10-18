// 拖拽上传功能 - 简化版本
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const detectBtn = document.getElementById('detectBtn');
const loading = document.getElementById('loading');
const resultsSection = document.getElementById('resultsSection');

let currentFile = null;

// 基本事件处理
uploadArea.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        currentFile = e.target.files[0];
        detectBtn.disabled = false;
        console.log('文件已选择:', currentFile.name);
    }
});

// 检测按钮点击
detectBtn.addEventListener('click', async function () {
    if (!currentFile) return;

    const formData = new FormData();
    formData.append('file', currentFile);

    // 显示加载
    loading.style.display = 'block';
    resultsSection.style.display = 'none';

    try {
        console.log('开始发送检测请求...');
        const response = await fetch('/detect', {
            method: 'POST',
            body: formData
        });

        console.log('收到响应:', response.status);
        const result = await response.json();
        console.log('响应数据:', result);

        if (result.success) {
            displaySimpleResults(result);
        } else {
            alert('错误: ' + (result.error || '未知错误'));
        }
    } catch (error) {
        console.error('网络错误:', error);
        alert('网络错误: ' + error.message);
    } finally {
        loading.style.display = 'none';
    }
});

function displaySimpleResults(result) {
    const originalContainer = document.getElementById('originalContainer');
    const resultContainer = document.getElementById('resultContainer');
    const statisticsInfo = document.getElementById('statisticsInfo');
    const detectionInfo = document.getElementById('detectionInfo');

    // 简单显示结果
    if (result.result_type === 'video') {
        originalContainer.innerHTML = `<p>视频文件: ${result.original_file}</p>`;
        resultContainer.innerHTML = `<p>结果视频: ${result.result_file || '处理中'}</p>`;
    } else {
        originalContainer.innerHTML = `<img src="/uploads/${result.original_file}" alt="原图" style="max-width: 300px;">`;
        if (result.result_file) {
            resultContainer.innerHTML = `<img src="/uploads/${result.result_file}" alt="检测结果" style="max-width: 300px;">`;
        }
    }

    // 简单显示统计
    const stats = result.statistics || { total_count: 0 };
    statisticsInfo.innerHTML = `<p>检测到 ${stats.total_count} 个松花</p>`;

    // 简单显示详情
    let detailsHTML = `<p>检测时间: ${result.timestamp}</p>`;
    if (result.detections && result.detections.length > 0) {
        result.detections.forEach((det, i) => {
            detailsHTML += `<p>松花 ${i + 1}: ${det.class_chinese || det.class_name} (${(det.confidence * 100).toFixed(1)}%)</p>`;
        });
    }
    detectionInfo.innerHTML = detailsHTML;

    resultsSection.style.display = 'block';
}

// 初始化
document.addEventListener('DOMContentLoaded', function () {
    console.log('松花检测平台已加载 - 简化版本');
});