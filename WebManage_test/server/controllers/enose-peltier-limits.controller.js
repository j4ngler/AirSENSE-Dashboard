const axios = require('axios');
const { isIPv4 } = require('net');

function rootIp(deviceCode) {
  const roots = JSON.parse(process.env.ENOSE_ROOT_IPS || '{}');
  const ip = roots && Object.prototype.hasOwnProperty.call(roots, deviceCode) ? roots[deviceCode] : null;
  if (typeof ip !== 'string' || !isIPv4(ip)) return null;
  const [a, b] = ip.split('.').map(Number);
  return a === 10 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) ? ip : null;
}

const fields = ['temperatureLow', 'temperatureHigh', 'humidityLow', 'humidityHigh'];
const validLimits = ([tLow, tHigh, hLow, hHigh]) =>
  [tLow, tHigh, hLow, hHigh].every(Number.isInteger) &&
  tLow >= -400 && tHigh <= 1250 && tLow < tHigh &&
  hLow >= 0 && hHigh <= 1000 && hLow < hHigh;
const validRequestId = id => Number.isInteger(id) && id > 0 && id <= 0xffffffff;

async function forward(req, res) {
  const write = req.method === 'POST';
  let payload;
  if (write) {
    const origin = req.get('Origin');
    if (req.get('X-AirSENSE-Peltier') !== '1' ||
        (origin && !['http://', 'https://'].some(scheme => origin === scheme + req.get('Host')))) {
      return res.status(403).json({ message: 'Mở tab E-Nose trên cùng địa chỉ với backend AirSENSE.' });
    }
    const values = fields.map(field => req.body?.[field]);
    const scaled = values.map(value => Number.isFinite(value) ? Math.round(value * 10) : NaN);
    if (!validLimits(scaled) || values.some((value, index) => Math.abs(value * 10 - scaled[index]) > 1e-8)) {
      return res.status(400).json({ message: 'Nhập ngưỡng thấp < ngưỡng cao, tối đa một chữ số thập phân.' });
    }
    payload = Object.fromEntries(fields.map((field, index) => [field, scaled[index]]));
  }

  let ip;
  try {
    ip = rootIp(req.params.id);
  } catch {
    return res.status(503).json({ message: 'Cấu hình ENOSE_ROOT_IPS không hợp lệ.' });
  }
  if (!ip) return res.status(503).json({ message: 'Chưa cấu hình IP LAN của Root cho thiết bị này.' });

  try {
    const response = await axios.request({
      url: `http://${ip}/api/peltier/limits`,
      method: req.method,
      data: payload,
      headers: write ? { 'X-E-Nose-Peltier': '1' } : undefined,
      proxy: false,
      maxRedirects: 0,
      maxContentLength: 2048,
      timeout: 2500,
      validateStatus: () => true,
    });
    const data = response.data;
    res.set('Cache-Control', 'no-store');
    if (write && response.status === 202 && validRequestId(data?.requestId)) {
      return res.status(202).json({ requestId: data.requestId });
    }
    if (!write && response.status === 200 && typeof data?.online === 'boolean' &&
        (data.requestId === 0 || validRequestId(data.requestId)) &&
        Number.isInteger(data.result) && data.result >= 0 && data.result <= 5) {
      const raw = fields.map(field => data[field]);
      const limits = data.online && validLimits(raw)
        ? Object.fromEntries(fields.map((field, index) => [field, raw[index] / 10])) : null;
      return res.json({ online: data.online, requestId: data.requestId, result: data.result, limits });
    }
    if (response.status === 409) return res.status(409).json({ message: 'Bo đang chờ xác nhận một yêu cầu khác.' });
    if (response.status === 503) return res.status(503).json({ message: 'Root chưa kết nối bo Peltier hoặc chưa bật Mesh.' });
    return res.status(502).json({ message: 'ESP Root chưa trả về trạng thái ngưỡng hợp lệ.' });
  } catch {
    return res.status(503).json({ message: 'Không liên lạc được với ESP Root qua LAN.' });
  }
}

module.exports = forward;
