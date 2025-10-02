<template>
  <view class="container">
    <view class="nav-bar">
      <text class="back-btn" @click="goBack">返回</text>
      <view class="nav-title">学生进步分析</view>
    </view>
    <!-- 顶部tab栏 -->
    <view class="tab-bar">
      <view :class="['tab-item', activeTab==='class' ? 'active' : '']" @click="switchTab('class')">班课</view>
      <view :class="['tab-item', activeTab==='one2one' ? 'active' : '']" @click="switchTab('one2one')">一对一</view>
      <view :class="['tab-item', activeTab==='tuochansheng' ? 'active' : '']" @click="switchTab('tuochansheng')">脱产生</view>
    </view>
    <view class="main-content">
      <!-- 左侧分组栏 -->
      <view class="sidebar">
        <view v-for="cls in currentClassList" :key="cls.name"
          :class="['sidebar-item', selectedClass === cls.name ? 'active' : '']"
          @click="onClassChange(cls.name)">
          <view class="class-name">
            <view class="class-grade">{{ parseClassName(cls.name).grade }}</view>
            <view class="class-subject">{{ parseClassName(cls.name).subject }}</view>
            <view class="class-type">{{ parseClassName(cls.name).type }}</view>
          </view>
          <view class="class-count">（{{ cls.count }}人）</view>
        </view>
      </view>
      <!-- 右侧内容区 -->
      <view class="content-area">
        <view v-if="loading" class="loading">加载中...</view>
        <view v-else>
          <!-- 进步人数/总人数，始终显示 -->
          <view class="class-avg-info" v-if="activeTab !== 'one2one'">
            <text>
              <span class="progress-count">进步人数：{{ classProgressCount }}</span>
              &nbsp;&nbsp;
              <span class="total-count">总人数：{{ classTotalCount }}</span>
            </text>
          </view>
          <!-- 新增表头说明 -->
          <view class="student-progress-header">
            <text class="header-name">姓名</text>
            <text class="header-prev-score">上一次的成绩</text>
            <text class="header-latest-score">最新一次成绩</text>
            <text class="header-progress-rate">提升率</text>
          </view>
          <view v-for="stu in filteredStudents" :key="stu._id" class="student-progress-row">
            <text class="stu-name stu-name-colored">{{ stu.studentName }}</text>
            <text class="score score-first">
              {{ scoresLabel(stu) }}: {{ stu.prevScore !== null ? stu.prevScore : '无' }}
            </text>
            <text class="score score-second">
              最新: {{ stu.latestScore !== null ? stu.latestScore : '无' }}
            </text>
            <text :class="['progress-rate', stu.progressRate >= 0 ? 'positive' : 'negative']">
              {{ stu.progressRate !== null ? (stu.progressRate > 0 ? '+' : '') + stu.progressRate + '%' : '无' }}
            </text>
          </view>
          <view v-if="classAvgRate !== null && activeTab === 'class'" class="class-avg-row progress-summary-card">
            <view class="progress-title">班级进步率</view>
            <view class="progress-rate-box">
              <view class="progress-card">
                <view class="progress-card-title">班级人数进步率</view>
                <view class="progress-card-value">
                  <text :class="['progress-rate', classProgressCount > 0 ? 'positive' : 'negative']">{{ classTotalCount > 0 ? ((classProgressCount/classTotalCount*100).toFixed(1)+'%') : '0%' }}</text>
                </view>
                <view class="progress-count-info progress-count-info-inline">
                  <text class="progress-count">进步人数：{{ classProgressCount }}</text>
                  <text class="progress-slash"> / </text>
                  <text class="total-count">总人数：{{ classTotalCount }}</text>
                </view>
              </view>
              <view class="progress-card">
                <view class="progress-card-title">班级分数进步率</view>
                <view class="progress-card-value">
                  <text :class="['progress-rate', Number(classAvgRate) >= 0 ? 'positive' : 'negative']">{{ Number(classAvgRate) > 0 ? '+' : '' }}{{ classAvgRate }}%</text>
                </view>
                <view class="progress-avg-info">
                  <view><text class="avg-label">上次均分：</text><text class="avg-value">{{ classPrevAvg }}</text></view>
                  <view style="margin-top:2px;"><text class="avg-label">最新均分：</text><text class="avg-value">{{ classLatestAvg }}</text></view>
                </view>
              </view>
            </view>
            <view class="progress-tip" style="margin-top: 8px; color: #888; font-size: 13px;">
              （无入门测成绩以及无最新一次成绩不计入总人数）
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      activeTab: 'class', // 'class' | 'one2one' | 'tuochansheng'
      classList: [],
      one2oneList: [],
      tuochanshengList: [],
      selectedClass: '',
      classStudents: [],
      oneToOneStudents: [],
      tuochanshengStudents: [],
      filteredStudents: [],
      loading: false,
      classAvgRate: null, // 班级平均进步率
      classProgressCount: 0, // 进步人数
      classTotalCount: 0, // 有最新成绩的总人数
      classPrevAvg: '-', // 上次均分
      classLatestAvg: '-', // 最新均分
    }
  },
  computed: {
    currentClassList() {
      if (this.activeTab === 'class') return this.classList;
      if (this.activeTab === 'one2one') return this.one2oneList;
      return this.tuochanshengList;
    }
  },
  onLoad() {
    // 权限检查：教务管理员不能访问进步分析功能
    const userInfo = uni.getStorageSync('userInfo');
    const isAcademic = userInfo && (Array.isArray(userInfo.role) ? userInfo.role.includes('教务') : userInfo.role === '教务');
    if (isAcademic) {
      uni.showToast({ 
        title: '教务管理员无权限访问进步分析功能', 
        icon: 'none',
        duration: 2000
      });
      setTimeout(() => {
        uni.navigateBack();
      }, 2000);
      return;
    }
    
    this.loadAllStudents();
  },
  methods: {
    async loadAllStudents() {
      this.loading = true;
      try {
        const userInfo = uni.getStorageSync('userInfo');
        const teacherId = userInfo?._id;
        if (!teacherId) {
          uni.showToast({ title: '未登录', icon: 'none' });
          return;
        }
        const res = await uniCloud.callFunction({
          name: 'student-hours',
          data: {
            action: 'getMyClassStudentsByType',
            teacherId
          }
        });
        if (res.result.code !== 200) {
          uni.showToast({ title: res.result.message, icon: 'none' });
          return;
        }
        // 直接取云函数返回的classStudents和oneToOneStudents
        const classStudents = res.result.data.classStudents || [];
        const oneToOneStudents = res.result.data.oneToOneStudents || [];
        // 脱产生学生
        const tuochanshengStudents = [
          ...classStudents,
          ...oneToOneStudents
        ].filter(stu => (stu.courseType || '').trim() === '脱产生');
        // 统计班课分组（按className，如果为空则使用年级）
        const classMap = {};
        classStudents.forEach(stu => {
          let group = (stu.className || '').trim();
          if (!group) {
            group = stu.grade || '未分组';
          }
          stu._group = group;
          if (!classMap[group]) classMap[group] = 0;
          classMap[group]++;
        });
        this.classList = Object.keys(classMap).map(name => ({ name, count: classMap[name] }));
        // 统计一对一分组（按grade）
        const one2oneMap = {};
        oneToOneStudents.forEach(stu => {
          const group = (stu.grade || '未分组').trim();
          stu._group = group;
          if (!one2oneMap[group]) one2oneMap[group] = 0;
          one2oneMap[group]++;
        });
        this.one2oneList = Object.keys(one2oneMap).map(name => ({ name, count: one2oneMap[name] }));
        // 统计脱产生分组（按grade）
        const tuochanshengMap = {};
        tuochanshengStudents.forEach(stu => {
          const group = (stu.grade || '未分组').trim();
          stu._group = group;
          if (!tuochanshengMap[group]) tuochanshengMap[group] = 0;
          tuochanshengMap[group]++;
        });
        this.tuochanshengList = Object.keys(tuochanshengMap).map(name => ({ name, count: tuochanshengMap[name] }));
        this.classStudents = classStudents;
        this.oneToOneStudents = oneToOneStudents;
        this.tuochanshengStudents = tuochanshengStudents;
        // 默认选中第一个tab和分组
        this.activeTab = 'class';
        this.selectedClass = this.classList.length ? this.classList[0].name : '';
        await this.updateFilteredStudents();
      } catch (e) {
        uni.showToast({ title: '加载失败', icon: 'none' });
      }
      this.loading = false;
    },
    async updateFilteredStudents() {
      this.loading = true;
      let students;
      if (this.activeTab === 'class') students = this.classStudents;
      else if (this.activeTab === 'one2one') students = this.oneToOneStudents;
      else students = this.tuochanshengStudents;
      let filtered = students.filter(stu => (stu._group || '').trim() === this.selectedClass);
      // 获取进步率
      for (let stu of filtered) {
        // 获取最近两次成绩，确保按 examDate（无则 createTime）降序
        const scoreRes = await uniCloud.callFunction({
          name: 'exam-scores',
          data: {
            action: 'getLatestTwoScores',
            studentId: stu._id,
            subject: stu.subject
          }
        });
        let scores = scoreRes.result.code === 200 ? scoreRes.result.data : [];
        // 手动排序，确保最新成绩在前
        scores.sort((a, b) => {
          const dateA = new Date(a.examDate || a.createTime || 0).getTime();
          const dateB = new Date(b.examDate || b.createTime || 0).getTime();
          return dateB - dateA;
        });
        let entranceScore = Number(stu.entranceTestScore);
        let progressRate = null;
        let latestScore = null;
        let prevScore = null;
        if (scores.length === 1) {
          latestScore = Number(scores[0].score);
          prevScore = entranceScore; // 只有一次成绩时，用入门测
          if (!isNaN(entranceScore) && entranceScore > 0) {
            progressRate = (((latestScore - entranceScore) / entranceScore) * 100).toFixed(1);
          }
        } else if (scores.length >= 2) {
          latestScore = Number(scores[0].score);
          prevScore = Number(scores[1].score); // 有两次成绩时，用上一次成绩
          if (!isNaN(prevScore) && prevScore > 0) {
            // 严格用 (最新-上一次)/上一次*100%
            progressRate = (((latestScore - prevScore) / prevScore) * 100).toFixed(1);
          }
        }
        // 调试输出
        console.log('学生:', stu.studentName, 'entranceTestScore:', entranceScore, 'latestScore:', latestScore, 'prevScore:', prevScore, 'progressRate:', progressRate, 'scores:', scores);
        stu.latestScore = latestScore;
        stu.prevScore = prevScore;
        stu.progressRate = (progressRate !== null && !isNaN(progressRate)) ? progressRate : null;
      }
      this.filteredStudents = filtered;

      // ========== 新增：年级和分段判断函数 ==========
      function getGradeNum(gradeStr) {
        // 提取“X年级”中的X，返回数字
        if (!gradeStr) return null;
        const match = gradeStr.match(/(\d+)/);
        if (match) return parseInt(match[1]);
        // 中文数字转阿拉伯数字
        const cnNumMap = { '一':1, '二':2, '三':3, '四':4, '五':5, '六':6, '七':7, '八':8, '九':9 };
        const cn = gradeStr.match(/([一二三四五六七八九])/);
        if (cn) return cnNumMap[cn[1]];
        return null;
      }
      function getScoreSection(gradeNum, score) {
        // 返回分段：'high'|'upper'|'middle'|'low'
        if (gradeNum >= 1 && gradeNum <= 6) {
          if (score >= 95 && score <= 100) return 'high';
          if (score >= 90 && score <= 94) return 'upper';
          if (score >= 60 && score <= 89) return 'middle';
          if (score >= 0 && score <= 59) return 'low';
        } else if (gradeNum >= 7 && gradeNum <= 9) {
          if (score >= 100 && score <= 120) return 'high';
          if (score >= 90 && score < 100) return 'upper';
          if (score >= 72 && score < 90) return 'middle';
          if (score >= 0 && score < 72) return 'low';
        }
        return null;
      }
      function isProgress(stu) {
        // 按新规则判断是否进步
        const gradeNum = getGradeNum(stu.grade);
        const latest = Number(stu.latestScore);
        const prev = Number(stu.prevScore);
        if (isNaN(gradeNum) || isNaN(latest) || isNaN(prev)) return false;
        const latestSection = getScoreSection(gradeNum, latest);
        const prevSection = getScoreSection(gradeNum, prev);
        const sectionOrder = ['low', 'middle', 'upper', 'high'];
        const latestIdx = sectionOrder.indexOf(latestSection);
        const prevIdx = sectionOrder.indexOf(prevSection);
        if (latestIdx === -1 || prevIdx === -1) return false;
        // 分段提升，必算进步
        if (latestIdx > prevIdx) return true;
        // 分段持平，按原分段规则判断
        if (latestIdx === prevIdx) {
          if (latestSection === 'high') return true; // 高分段不掉出算进步
          if (latestSection === 'upper' && latest >= prev) return true; // 中上分段分数不降算进步
          if (latestSection === 'middle' && latest > prev) return true; // 中等分段分数提升才算进步
          if (latestSection === 'low' && latest > prev) return true; // 低分段分数提升才算进步
        }
        // 分段下降，不算进步
        return false;
      }
      // ========== END ==========

      // 计算班级平均进步率和进步人数
      const validStudents = filtered.filter(stu => stu.latestScore !== null && stu.prevScore !== null && !isNaN(Number(stu.latestScore)) && !isNaN(Number(stu.prevScore)) && Number(stu.prevScore) > 0);
      let classAvgRate = null;
      let classPrevAvg = '-';
      let classLatestAvg = '-';
      if (validStudents.length > 0) {
        // 上次均分：有上一次成绩的学生的上一次成绩总和/人数
        const prevScoreList = validStudents.filter(stu => stu.prevScore !== null && !isNaN(Number(stu.prevScore))).map(stu => Number(stu.prevScore));
        const avgPrev = prevScoreList.length > 0 ? prevScoreList.reduce((a, b) => a + b, 0) / prevScoreList.length : null;
        // 最新均分：所有有最新成绩的学生的最新成绩总和/人数（不只validStudents）
        const allLatestScoreList = filtered.filter(stu => stu.latestScore !== null && !isNaN(Number(stu.latestScore))).map(stu => Number(stu.latestScore));
        const avgLatest = allLatestScoreList.length > 0 ? allLatestScoreList.reduce((a, b) => a + b, 0) / allLatestScoreList.length : null;
        classPrevAvg = avgPrev !== null ? avgPrev.toFixed(1) : '-';
        classLatestAvg = avgLatest !== null ? avgLatest.toFixed(1) : '-';
        if (avgPrev > 0) {
          classAvgRate = (((avgLatest - avgPrev) / avgPrev) * 100).toFixed(1);
        }
      }
      this.classAvgRate = classAvgRate;
      this.classPrevAvg = classPrevAvg;
      this.classLatestAvg = classLatestAvg;
      // 进步人数和总人数（按新规则）
      const progressCount = validStudents.filter(stu => isProgress(stu)).length;
      const totalCount = validStudents.length;
      this.classProgressCount = progressCount;
      this.classTotalCount = totalCount;
      this.loading = false;
      // 调试输出
      console.log('进步人数:', this.classProgressCount, '总人数:', this.classTotalCount, 'filteredStudents:', this.filteredStudents);
    },
    switchTab(tab) {
      if (this.activeTab === tab) return;
      this.activeTab = tab;
      const list = this.currentClassList;
      this.selectedClass = list.length ? list[0].name : '';
      this.updateFilteredStudents();
    },
    onClassChange(clsName) {
      this.selectedClass = clsName;
      this.updateFilteredStudents();
    },
    goBack() {
      uni.reLaunch({
        url: '/pages/service/service'
      });
    },
    scoresLabel(stu) {
      // 如果只有一次成绩，prevScore 就是入门测，否则是上一次成绩
      if (stu.prevScore === Number(stu.entranceTestScore)) {
        return '入门测';
      }
      return '上一次';
    },
    parseClassName(name) {
      // 支持“X年级XX科目XX班型”或“X年级XX科目”或“X年级”
      if (!name) return { grade: '', subject: '', type: '' };
      // 先匹配“X年级XX科目XX班型”
      let match = name.match(/^(.*年级)([^班]+)?([\u4e00-\u9fa5]+班)?$/);
      if (match) {
        return {
          grade: match[1] ? match[1].trim() : '',
          subject: match[2] ? match[2].trim() : '',
          type: match[3] ? match[3].trim() : ''
        };
      } else {
        // 兜底：全部显示在年级
        return { grade: name, subject: '', type: '' };
      }
    }
  }
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #f5f5f5;
}
.nav-bar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  text-align: center;
  padding-top: 55px;
  position: relative;
}
.nav-title {
  color: white;
  font-size: 18px;
  font-weight: bold;
}
.back-btn {
  position: absolute;
  left: 16px;
  top: 55px;
  color: white;
  font-size: 16px;
  z-index: 10;
}
.tab-bar {
  display: flex;
  flex-direction: row;
  background: #fff;
  border-bottom: 1px solid #eee;
  height: 44px;
  align-items: center;
}
.tab-item {
  flex: 1;
  text-align: center;
  font-size: 16px;
  color: #666;
  padding: 10px 0;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: color 0.2s, border-color 0.2s;
}
.tab-item.active {
  color: #667eea;
  font-weight: bold;
  border-bottom: 2px solid #667eea;
  background: #f0f4ff;
}
.main-content {
  display: flex;
  flex-direction: row;
  width: 100%;
}
.sidebar {
  flex-shrink: 0;
  width: 50px;
  background: #fff;
  border-right: 1px solid #eee;
  padding: 6px 0 6px 0;
}
.sidebar-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px 0;
  font-size: 13px;
  color: #333;
  cursor: pointer;
  border-radius: 0 20px 20px 0;
  margin-bottom: 8px;
  background: transparent;
  transition: background 0.2s, color 0.2s;
}
.sidebar-item.active {
  background: #f0f4ff;
  color: #667eea;
  font-weight: bold;
}
.class-name {
  font-size: 14px;
  display: block;
  line-height: 1.2em;
  margin-bottom: 2px;
}
.class-grade, .class-subject, .class-type {
  font-size: 14px;
  line-height: 1.2em;
  text-align: left;
  min-height: 1.2em;
}
.class-count {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
}
.content-area {
  flex: 1;
  min-width: 0;
  margin-left: 0px;
  padding-right: 12px;
}
.my-class-progress {
  background: white;
  margin: 10px;
  border-radius: 8px;
  padding: 20px;
}
.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 10px;
}
.student-progress-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}
.student-progress-row:last-child {
  border-bottom: none;
}
.stu-name { font-size: 15px; color: #333; width: 80px; }
/* 新增颜色样式 */
.stu-name-colored { color: #2a4fa7; font-weight: bold; }
.score { font-size: 13px; color: #666; width: 80px; }
.score-first { color: #555; }
.score-second { color: #3f51b5; } /* 蓝色 */
.progress-rate { font-size: 15px; font-weight: bold; width: 80px; text-align: right; }
.progress-rate.positive { color: #4caf50; }
.progress-rate.negative { color: #f44336; }
.progress-count { color: #2a4fa7; font-weight: bold; }
.total-count { color: #ff9800; font-weight: bold; }
.loading { text-align: center; color: #999; margin-top: 40px; }
.class-avg-row {
  background: #f8fafd;
  border-top: 1px solid #eee;
}
.class-avg-info {
  color: #444;
  font-size: 13px;
  margin: 0 0 10px 0;
  padding-left: 10px;
}
.progress-summary-card {
  background: #f8fafd;
  border-radius: 10px;
  margin: 18px 0 10px 0;
  padding: 12px 10px 8px 10px;
  box-shadow: 0 2px 8px rgba(102,126,234,0.06);
}
.progress-title {
  font-size: 15px;
  font-weight: bold;
  color: #333;
  margin-bottom: 12px;
}
.progress-rate-box {
  display: flex;
  flex-direction: row;
  gap: 10px;
  flex-wrap: nowrap;
  justify-content: flex-start;
}
.progress-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(102,126,234,0.04);
  padding: 10px 12px 8px 12px;
  min-width: 120px;
  max-width: 180px;
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.progress-card-title {
  font-size: 13px;
  color: #888;
  margin-bottom: 6px;
}
.progress-card-value {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
}
.progress-count-info {
  font-size: 13px;
  margin-bottom: 2px;
}
.progress-count {
  color: #2a4fa7;
  font-weight: bold;
}
.progress-slash {
  color: #888;
}
.total-count {
  color: #ff9800;
  font-weight: bold;
}
.progress-tip {
  font-size: 12px;
  color: #aaa;
  margin-top: 2px;
}
.progress-count-info-inline {
  font-size: 13px;
  margin-bottom: 2px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.progress-tip-inline {
  font-size: 12px;
  color: #aaa;
  margin-left: 6px;
  display: block;
  text-align: left;
  line-height: 1.4;
  max-width: 90%;
  word-break: break-all;
  white-space: pre-line;
}
.progress-tip-multiline {
  white-space: pre-line;
}
.progress-avg-info {
  font-size: 13px;
  color: #888;
  margin-top: 2px;
  text-align: left;
}
.avg-label {
  color: #888;
}
.avg-value {
  color: #2a4fa7;
  font-weight: bold;
  margin-right: 2px;
}
@media (max-width: 350px) {
  .progress-rate-box {
    flex-direction: column;
    gap: 8px;
  }
  .progress-card {
    max-width: 100%;
    width: 100%;
  }
}
.main-content, .progress-content, .progress-main, .main-panel {
  margin-left: 0 !important;
  padding-left: 0 !important;
}
/* 表头样式 */
.student-progress-header {
  display: flex;
  align-items: center;
  padding: 6px 12px 6px 0;
  font-size: 13px;
  color: #888;
  font-weight: bold;
}

/* 表格行样式 */
.student-progress-row {
  display: flex;
  align-items: center;
  padding: 12px 12px 12px 0;
  border-bottom: 1px solid #eee;
}

.student-progress-row:last-child {
  border-bottom: none;
}

/* 列宽和对齐设置 */
.student-progress-header text,
.student-progress-row text {
  display: inline-block;
  text-align: center;
  font-size: 15px;
  width: 84px;
  flex-shrink: 0;
}

/* 最后一列（提升率）右对齐 */
.student-progress-header text:last-child,
.student-progress-row text:last-child {
  width: 88px;
  text-align: right;
  white-space: nowrap;
}

/* 移除之前的margin设置，确保列连续对齐 */
.score-first,
.score-second {
  margin-right: 0;
}
</style> 