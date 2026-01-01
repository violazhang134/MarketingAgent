---
title: "Generations（Seedream 4.5） - 302.AI API文档"
source: "https://doc.302.ai/385925488e0"
author:
published:
created: 2026-01-02
description: "Generations（Seedream 4.5） - 302.AI API文档"
tags:
  - "globalgames"
---
即梦最新的模型，支持文生图和图生图

模型名：  
**doubao-seedream-4-5-251128**

功能：

生成组图（组图：基于您输入的内容，生成的一组内容关联的图片；需配置sequential_image_generation为auto）

多图生组图，根据您输入的 多张参考图片（2-10）+文本提示词 生成一组内容关联的图片（输入的参考图数量+最终生成的图片数量≤15张）。

单图生组图，根据您输入的 单张参考图片+文本提示词 生成一组内容关联的图片（最多生成14张图片）。

文生组图，根据您输入的 文本提示词 生成一组内容关联的图片（最多生成15张图片）。

生成单图（配置sequential_image_generation为disabled）

多图生图，根据您输入的 多张参考图片（2-10）+文本提示词 生成单张图片。

单图生图，根据您输入的 单张参考图片+文本提示词 生成单张图片。

文生图，根据您输入的 文本提示词 生成单张图片。

**价格：0.04 PTC/张**

推荐可选的宽高：

|分辨率|宽高比|分辨率（px）|
|---|---|---|
|**2K**|1:1|**2048 × 2048**|
||4:3|**2304 × 1728**|
||3:2|**2496 × 1664**|
||16:9|**2560 × 1440**|
||21:9|**3024 × 1296**|
|**4K**|1:1|**4096 × 4096**|
||4:3|**4694 × 3520**|
||3:2|**4992 × 3328**|
||16:9|**5404 × 3040**|
||21:9|**6198 × 2656**|

## 请求参数

Header 参数

Authorization

string 

可选

示例:

Bearer {{YOUR_API_KEY}}

Content-Type

string 

可选

示例:

application/json

Body 参数application/json

model

string 

必需

doubao-seedream-4-0-250828

prompt

string 

必需

用于生成图像的提示词。

image

array[string]

参考图

可选

size

enum<string> 

可选

总像素取值范围：  
seedream 4.5：[2560x1440=3686400, 4096x4096=16777216]

枚举值:

2K4K

seed

integer 

可选

随机数种子，用于控制模型生成内容的随机性。取值范围为 [-1, 2147483647]。如果不提供，则算法自动生成一个随机数作为种子。如果希望生成内容保持一致，可以使用相同的 seed 参数值。

sequential_image_generation

enum<string> 

可选

组图：基于您输入的内容，生成的一组内容关联的图片。

枚举值:

auto自动判断模式，模型会根据用户提供的提示词自主判断是否返回组图以及组图包含的图片数量。disabled关闭组图功能，模型只会生成一张图。

sequential_image_generation_options

object 

可选

sequential_image_generation_options.max_images integer 可选 默认值 15  
指定本次请求，最多可生成的图片数量。  
取值范围： [1, 15]

max_images

integer 

必需

response_format

string 

可选

指定生成图像的返回格式。支持以下两种取值：  
"url"：以可下载的 JPEG 图片链接形式返回；  
"b64_json"：以 Base64 编码字符串的 JSON 格式返回图像数据。

stream

boolean 

可选

控制是否开启流式输出模式。  
false：非流式输出模式，等待所有图片全部生成结束后再一次性返回所有信息。  
true：流式输出模式，即时返回每张图片输出的结果。在生成单图和组图的场景下，流式输出模式均生效。

watermark

boolean 

可选

是否在生成的图片中添加水印。  
false：不添加水印。  
true：在图片右下角添加“AI生成”字样的水印标识。

示例

## 返回响应

🟢200成功

application/json

# 响应参数说明

## 字段列表

|字段名|类型|说明|
|---|---|---|
|model|string|本次请求使用的模型 ID（模型名称-版本）。|
|created|integer|本次请求创建时的 Unix 时间戳（秒）。|
|data|list|输出图片的信息，包括图片下载的 URL 或 Base64。  <br>- 当指定返回格式为 url 时，字段为 `url`  <br>- 当指定返回格式为 b64_json 时，字段为 `b64_json`  <br>**注意：为确保信息安全，url 链接将在生成后 24 小时内失效，请务必及时保存图片。**|
|usage|object|图片生成相关信息。  <br>- `usage.generated_images`（integer）：模型生成的图片张数。|
|error|object|错误信息（可选）。  <br>- `error.code`（string）：错误码  <br>- `error.message`（string）：错误提示信息|

---

## data 字段说明

当 `response_format` 为 `url` 时，`data` 数组的每个元素包含字段：

`url`：图片下载地址

当 `response_format` 为 `b64_json` 时，`data` 数组的每个元素包含字段：

`b64_json`：图片的 Base64 编码字符串

---

## usage 字段说明

`usage.generated_images`：模型生成的图片张数（integer）

---

## error 字段说明（可选）

`error.code`：错误码（string）

`error.message`：错误提示信息（string）

---

Body

model

string 

必需

created

integer 

必需

data

array [object] 

必需

url

string 

可选

usage

object 

必需

generated_images

integer 

必需


图生图示例：
var myHeaders = new Headers(); myHeaders.append("Authorization", "Bearer "); myHeaders.append("Content-Type", "application/json"); var raw = JSON.stringify({ "model": "doubao-seedream-4-5-251128", "prompt": "将图1的服装换为图2的服装", "image": [ "https://ark-project.tos-cn-beijing.volces.com/doc_image/seedream4_imagesToimage_1.png", "https://ark-project.tos-cn-beijing.volces.com/doc_image/seedream4_5_imagesToimage_2.png" ], "sequential_image_generation": "disabled", "size": "2K", "watermark": false }); var requestOptions = { method: 'POST', headers: myHeaders, body: raw, redirect: 'follow' }; fetch("https://api.302.ai/doubao/images/generations", requestOptions) .then(response => response.text()) .then(result => console.log(result)) .catch(error => console.log('error', error));

响应示例：
{ "model": "doubao-seedream-4-0-250828", "created": 1757321139, "data": [ { "url": "https://...", "size": "3104x1312" } ], "usage": { "generated_images": 1, "output_tokens": xxx, "total_tokens": xxx } }