// 通用课程色块生成函数（HSL色相+明度分布，色相±40度，饱和度/明度波动，提升区分度）
export function getCourseColor(type, courseName) {
  // 主色映射（HSL色相为主）
  const typeHueMap = {
    '一对一': 350, // 粉红
    '班课': 120,   // 绿色（原210蓝色，改为绿色）
    '脱产生': 45,  // 黄
    '默认': 30    // 橙色（原220蓝紫，改为橙色）
  };
  const baseHue = typeHueMap[type] || typeHueMap['默认'];
  // 课程名做哈希
  let hash = 0;
  if (courseName) {
    for (let i = 0; i < courseName.length; i++) {
      hash = courseName.charCodeAt(i) + ((hash << 5) - hash);
    }
  }
  // 色相在主色±40度内波动
  const hue = (baseHue + (Math.abs(hash) % 80) - 40 + 360) % 360;
  // 饱和度70~90%
  const sat = 70 + (Math.abs(hash) % 21); // 70~90
  // 明度65~85%
  const light = 65 + (Math.abs(hash) % 21); // 65~85
  const bgColor = `hsl(${hue}, ${sat}%, ${light}%)`;
  // 判断明度自动切换黑/白字
  const textColor = light > 78 ? '#333' : '#fff';
  return `background:${bgColor};color:${textColor};font-weight:bold;`;
} 