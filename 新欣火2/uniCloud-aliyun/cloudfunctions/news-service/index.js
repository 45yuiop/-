'use strict';

const db = uniCloud.database();
const collection = db.collection('news');

exports.main = async (event, context) => {
  const { action, data, id, page = 1, pageSize = 20 } = event;
  try {
    switch (action) {
      case 'listNews':
        return await listNews(page, pageSize);
      case 'getNewsById':
        return await getNewsById(id);
      case 'createNews':
        return await createNews(data);
      case 'updateNews':
        return await updateNews(id, data);
      case 'deleteNews':
        return await deleteNews(id);
      case 'togglePin':
        return await togglePin(id);
      default:
        return { code: 400, message: '未知的操作类型' };
    }
  } catch (err) {
    console.error('news-service error:', err);
    return { code: 500, message: err.message || '服务器内部错误' };
  }
};

async function listNews(page, pageSize) {
  const skip = (page - 1) * pageSize;
  const res = await collection
    .orderBy('isPinned', 'desc')
    .orderBy('createTime', 'desc')
    .skip(skip)
    .limit(pageSize)
    .get();
  return { code: 0, data: res.data };
}

async function getNewsById(id) {
  if (!id) return { code: 400, message: '缺少id' };
  const res = await collection.doc(id).get();
  if (!res.data || res.data.length === 0) return { code: 404, message: '未找到新闻' };
  return { code: 0, data: res.data[0] };
}

async function createNews(data) {
  if (!data || !data.title || !Array.isArray(data.contentBlocks) || data.contentBlocks.length === 0) {
    return { code: 400, message: '请填写完整的新闻信息' };
  }
  const now = new Date().toISOString();
  const doc = {
    title: data.title,
    author: data.author || '',
    time: data.time || now.split('T')[0],
    content: data.content || '',
    contentBlocks: data.contentBlocks || [],
    isPinned: data.isPinned || false,
    createTime: now,
    updateTime: now
  };
  const res = await collection.add(doc);
  return { code: 0, message: '创建成功', data: { _id: res.id, ...doc } };
}

async function updateNews(id, data) {
  if (!id) return { code: 400, message: '缺少id' };
  const now = new Date().toISOString();
  const payload = {
    title: data.title,
    author: data.author,
    time: data.time,
    content: data.content,
    contentBlocks: data.contentBlocks,
    isPinned: data.isPinned !== undefined ? data.isPinned : false,
    updateTime: now
  };
  const res = await collection.doc(id).update(payload);
  return { code: 0, message: '更新成功', data: res }; 
}

async function deleteNews(id) {
  if (!id) return { code: 400, message: '缺少id' };
  const res = await collection.doc(id).remove();
  return { code: 0, message: '删除成功', data: res };
}

async function togglePin(id) {
  if (!id) return { code: 400, message: '缺少id' };
  
  // 先获取当前新闻的置顶状态
  const newsRes = await collection.doc(id).get();
  if (!newsRes.data || newsRes.data.length === 0) {
    return { code: 404, message: '未找到新闻' };
  }
  
  const currentNews = newsRes.data[0];
  const newPinStatus = !currentNews.isPinned;
  
  const now = new Date().toISOString();
  const res = await collection.doc(id).update({
    isPinned: newPinStatus,
    updateTime: now
  });
  
  return { 
    code: 0, 
    message: newPinStatus ? '置顶成功' : '取消置顶成功', 
    data: { isPinned: newPinStatus, ...res } 
  };
}


