import https from 'https';

/**
 * SSO 认证中间件
 * 通过转发 Cookie 到 page-gateway 验证当前用户身份
 * 注意：鲁班容器 Node.js 无原生 fetch，改用 https 模块
 */

/** 用 https 模块请求 page-gateway，返回 { status, data } */
function requestPageGateway(cookie) {
    return new Promise((resolve, reject) => {
        const req = https.get(
            'https://page-gateway.nioint.com/account/current',
            { headers: { cookie } },
            (res) => {
                let body = '';
                res.on('data', (chunk) => { body += chunk; });
                res.on('end', () => {
                    try {
                        resolve({ status: res.statusCode, data: JSON.parse(body) });
                    } catch {
                        resolve({ status: res.statusCode, data: null });
                    }
                });
            }
        );
        req.on('error', reject);
        req.setTimeout(5000, () => { req.destroy(new Error('page-gateway request timeout')); });
    });
}

export const authMiddleware = async (req, res, next) => {
    const cookie = req.headers.cookie;

    if (!cookie) {
        return res.status(401).json({ error: '未登录，请先通过 SSO 登录' });
    }

    try {
        const { status, data } = await requestPageGateway(cookie);

        if (status !== 200 || !data) {
            return res.status(401).json({ error: '登录已过期，请重新登录' });
        }

        // page-gateway 响应格式: { result_code, data: { user_name, display_name, ... } }
        const d = data.data || data;
        const username = d.user_name || d.username || d.domain_account || '';

        if (!username) {
            return res.status(401).json({ error: 'SSO 返回的用户信息无效' });
        }

        req.user = {
            id: username,
            username,
            displayName: d.display_name || d.displayName || d.nickName || username,
        };

        next();
    } catch (error) {
        console.error('SSO 验证失败:', error.message);
        return res.status(401).json({ error: `认证服务暂时不可用: ${error.message}` });
    }
};
