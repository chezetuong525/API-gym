# Hugging Face Proxy API

API này là một proxy đơn giản để FE gọi đến Hugging Face Inference API.

## Cài đặt

1. `npm install`
2. Tạo file `.env` với nội dung:

```
HUGGINGFACE_API_KEY=your_huggingface_api_token
PORT=3000
```

## Cấu hình FE

FE có thể gửi request tới endpoint:

- `POST /api/hf`
- body JSON:
  - `model`: tên model Hugging Face, ví dụ `gpt2`, `google/flan-t5-small`
  - `inputs`: dữ liệu đầu vào cho model
  - `parameters`: tuỳ chọn thêm cho inference
  - `options`: tuỳ chọn khác nếu cần

Ví dụ:

```json
{
  "model": "gpt2",
  "inputs": "Viết một đoạn giới thiệu bằng tiếng Việt về AI.",
  "parameters": {
    "max_new_tokens": 100
  }
}
```

## Triển khai lên Render

1. Tạo service mới `Web Service` trên Render.
2. Chọn repository chứa project này.
3. Build command: `npm install`
4. Start command: `npm start`
5. Thêm secret `HUGGINGFACE_API_KEY` trong tab Environment.

## Lưu ý

- Đảm bảo `HUGGINGFACE_API_KEY` có quyền gọi Hugging Face Inference API.
- Nếu FE và API ở domain khác nhau, `cors()` đã được bật sẵn.
