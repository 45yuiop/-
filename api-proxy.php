<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// 处理预检请求
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// 获取请求数据
$input = json_decode(file_get_contents('php://input'), true);

// uniCloud API地址
$apiUrl = 'https://fc-mp-9670c93e-7aef-46ce-bbba-401692257cfc.next.bspapp.com/data-stats';

// 准备POST数据
$postData = json_encode($input ?: ['type' => 'all']);

// 初始化cURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $apiUrl);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

// 执行请求
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

// 处理响应
if ($error) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => 'cURL错误: ' . $error
    ]);
} elseif ($httpCode !== 200) {
    http_response_code($httpCode);
    echo json_encode([
        'error' => true,
        'message' => 'API请求失败，状态码: ' . $httpCode
    ]);
} else {
    // 直接返回API响应
    echo $response;
}
?>
