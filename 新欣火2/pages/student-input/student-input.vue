<template>
  <view class="container">
    <!-- 自定义导航栏 -->
    <view class="custom-navbar">
      <view class="navbar-content">
        <view class="navbar-left" @click="goBack">
          <text class="back-icon">‹</text>
          <text class="back-text">返回</text>
        </view>
        <text class="navbar-title">学生录入</text>
        <view class="navbar-right"></view>
      </view>
    </view>
    
    
    <view class="form-container">
      <view class="form-item">
        <text class="label">学生姓名 *</text>
        <input 
          class="input" 
          v-model="formData.name" 
          placeholder="请输入学生姓名"
          maxlength="20"
        />
      </view>
      
      <view class="form-item">
        <text class="label">年级 *</text>
        <picker 
          mode="selector" 
          :value="gradeIndex" 
          :range="gradeOptions" 
          @change="onGradeChange"
        >
          <view class="picker">
            {{ formData.grade || '请选择年级' }}
            <text class="arrow">></text>
          </view>
        </picker>
      </view>
      
      <view class="form-item">
        <text class="label">所学科目 *</text>
        <view class="subject-selector" @click="showSubjectModal">
          <view class="subject-display">
            <text v-if="formData.subjects.length === 0" class="placeholder">请选择科目</text>
            <view v-else class="selected-subjects">
              <view 
                v-for="(subject, index) in formData.subjects" 
                :key="index"
                class="subject-tag"
              >
                <text class="subject-text">{{ subject }}</text>
                <text class="remove-btn" @click.stop="removeSubject(index)">×</text>
              </view>
            </view>
          </view>
          <text class="arrow">></text>
        </view>
      </view>
      
      <view class="form-item">
        <text class="label">班级</text>
        <view class="class-selector" @click="showClassModal">
          <view class="class-display">
            <text v-if="formData.classes.length === 0" class="placeholder">请选择班级（可选）</text>
            <view v-else class="selected-classes">
              <view 
                v-for="(classItem, index) in formData.classes" 
                :key="index"
                class="class-tag"
              >
                <text class="class-text">{{ classItem.className }}</text>
                <text class="remove-btn" @click.stop="removeClass(index)">×</text>
              </view>
            </view>
          </view>
          <text class="arrow">></text>
        </view>
      </view>
      
      <view class="form-item">
        <text class="label">学校</text>
        <input 
          class="input" 
          v-model="formData.school" 
          placeholder="请输入学校名称（可选）"
          maxlength="50"
        />
      </view>
      
      <view class="form-item">
        <text class="label">成绩录入</text>
        <view class="score-input-container">
          <view class="score-item" v-for="(score, index) in formData.scores" :key="index">
            <view class="score-subject">
              <text class="score-label">科目：</text>
              <picker 
                mode="selector" 
                :value="score.subjectIndex" 
                :range="allSubjects" 
                @change="(e) => onScoreSubjectChange(index, e.detail.value)"
              >
                <view class="score-picker">
                  {{ score.subject || '请选择科目' }}
                  <text class="arrow">></text>
                </view>
              </picker>
            </view>
            <view class="score-value">
              <text class="score-label">成绩：</text>
              <input 
                class="score-input" 
                v-model="score.score" 
                placeholder="请输入成绩"
                type="number"
                maxlength="3"
              />
            </view>
            <view class="score-actions">
              <text class="remove-score-btn" @click="removeScore(index)">删除</text>
            </view>
          </view>
          <view class="add-score-btn" @click="addScore">
            <text class="add-score-text">+ 添加成绩</text>
          </view>
        </view>
      </view>
    </view>
    
    <view class="preview-section">
      <text class="preview-title">学号预览</text>
      <view class="student-preview" v-if="formData.name && formData.grade">
        <view class="student-card">
          <view class="student-info">
            <text class="student-name">{{ formData.name }}</text>
            <text class="student-id">学号：{{ generatedStudentId }}</text>
            <text class="student-grade">年级：{{ formData.grade }}</text>
            <text class="student-subjects">科目：{{ formData.subjects.join('、') || '未选择' }}</text>
            <text class="student-classes" v-if="formData.classes.length > 0">班级：{{ formData.classes.map(c => c.className).join('、') }}</text>
            <text class="student-school" v-if="formData.school">学校：{{ formData.school }}</text>
          </view>
        </view>
      </view>
      <view v-else class="preview-placeholder">
        <text>请填写学生姓名和年级以预览学号</text>
      </view>
    </view>
    
    <view class="button-container">
      <button class="submit-btn" @click="submitStudent" :disabled="!canSubmit">
        确认录入
      </button>
    </view>
    
    <!-- 批量录入模式 -->
    <view class="batch-mode">
      <view class="batch-toggle" @click="toggleBatchMode">
        <text class="batch-text">{{ isBatchMode ? '退出批量录入' : '批量录入模式' }}</text>
        <text class="batch-icon">{{ isBatchMode ? '−' : '+' }}</text>
      </view>
      
      <view v-if="isBatchMode" class="batch-container">
        <view class="batch-info">
          <text>当前已录入 {{ batchStudents.length }} 名学生</text>
        </view>
        
        <view class="batch-list" v-if="batchStudents.length > 0">
          <view 
            v-for="(student, index) in batchStudents" 
            :key="index"
            class="batch-item"
          >
            <view class="batch-student-info">
              <text class="batch-name">{{ student.name }}</text>
              <text class="batch-id">{{ student.studentId }}</text>
            </view>
            <view class="batch-actions">
              <button class="batch-edit-btn" @click="editBatchStudent(index)">编辑</button>
              <button class="batch-delete-btn" @click="removeBatchStudent(index)">删除</button>
            </view>
          </view>
        </view>
        
        <view class="batch-actions">
          <button class="batch-clear-btn" @click="clearBatch" v-if="batchStudents.length > 0">
            清空列表
          </button>
          <button class="batch-submit-btn" @click="submitBatch" :disabled="batchStudents.length === 0">
            批量提交 ({{ batchStudents.length }})
          </button>
        </view>
      </view>
    </view>
    
    <!-- 科目选择弹窗 -->
    <view v-if="showSubjectModalFlag" class="subject-modal" @click="closeSubjectModal">
      <view class="subject-modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">选择科目</text>
          <view class="close-btn" @click="closeSubjectModal">
            <text class="close-icon">×</text>
          </view>
        </view>
        
        <view class="modal-body">
          <view class="subject-grid">
            <view 
              v-for="subject in allSubjects" 
              :key="subject"
              class="subject-item"
              :class="{selected: formData.subjects.includes(subject)}"
              @click="toggleSubject(subject)"
            >
              <text class="subject-name">{{ subject }}</text>
              <text v-if="formData.subjects.includes(subject)" class="check-icon">✓</text>
            </view>
          </view>
        </view>
        
        <view class="modal-footer">
          <button class="cancel-btn" @click="closeSubjectModal">取消</button>
          <button class="confirm-btn" @click="confirmSubjects">确定</button>
        </view>
      </view>
    </view>
    
    <!-- 班级选择弹窗 -->
    <view v-if="showClassModalFlag" class="class-modal" @click="closeClassModal">
      <view class="class-modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">选择班级</text>
          <view class="close-btn" @click="closeClassModal">
            <text class="close-icon">×</text>
          </view>
        </view>
        
        <view class="modal-body">
          <!-- 搜索框 -->
          <view class="search-container">
            <input 
              class="search-input" 
              v-model="classSearchKeyword" 
              placeholder="🔍 输入班级名称或年级进行搜索"
              @input="filterClasses"
            />
            <text class="search-icon">🔍</text>
          </view>
          
          <!-- 班级列表 -->
          <view class="class-list">
            <view 
              v-for="classItem in filteredClassList" 
              :key="classItem._id"
              class="class-item"
              :class="{selected: isClassSelected(classItem)}"
              @click="toggleClass(classItem)"
            >
              <view class="class-info">
                <view class="class-header">
                  <text class="class-name">{{ classItem.className }}</text>
                  <text class="class-grade">{{ classItem.grade }}</text>
                </view>
                <view class="class-details">
                  <text class="class-subject" v-if="classItem.subject">{{ classItem.subject }}</text>
                  <text class="class-teacher" v-if="classItem.headTeacher">班主任：{{ classItem.headTeacher }}</text>
                  <text class="class-student-count" v-if="classItem.studentCount !== undefined">学生数：{{ classItem.studentCount }}</text>
                </view>
              </view>
              <text v-if="isClassSelected(classItem)" class="check-icon">✓</text>
            </view>
            
            <!-- 无搜索结果提示 -->
            <view v-if="filteredClassList.length === 0 && classSearchKeyword" class="no-result">
              <text class="no-result-text">未找到匹配的班级</text>
            </view>
          </view>
        </view>
        
        <view class="modal-footer">
          <button class="cancel-btn" @click="closeClassModal">取消</button>
          <button class="confirm-btn" @click="confirmClasses">确定</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        name: '',
        grade: '',
        subjects: [],
        classes: [],
        school: '',
        scores: []
      },
      gradeIndex: 0,
      gradeOptions: [
        '一年级', '二年级', '三年级', '四年级', '五年级', '六年级',
        '七年级', '八年级', '九年级',
        '高一', '高二', '高三'
      ],
      allSubjects: [
        '语文', '数学', '英语', '物理', '化学'
      ],
      showSubjectModalFlag: false,
      showClassModalFlag: false,
      classList: [],
      filteredClassList: [],
      classSearchKeyword: '',
      isBatchMode: false,
      batchStudents: [],
      isLoading: false
    }
  },
  onLoad() {
    this.loadClassList();
  },
  computed: {
    generatedStudentId() {
      if (!this.formData.name || !this.formData.grade) return '';
      
      // 生成学号规则：年级代码 + 姓名拼音首字母 + 随机数字
      const gradeCode = this.getGradeCode(this.formData.grade);
      const nameCode = this.getNameCode(this.formData.name);
      const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      
      return `${gradeCode}${nameCode}${randomNum}`;
    },
    canSubmit() {
      return this.formData.name.trim() && 
             this.formData.grade && 
             this.formData.subjects.length > 0 &&
             !this.isLoading;
    }
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    onGradeChange(e) {
      this.gradeIndex = e.detail.value;
      this.formData.grade = this.gradeOptions[e.detail.value];
      
      // 年级变更时，清空已选择的班级并重新过滤班级列表
      this.formData.classes = [];
      this.filterClassesByGrade();
    },
    showSubjectModal() {
      this.showSubjectModalFlag = true;
    },
    closeSubjectModal() {
      this.showSubjectModalFlag = false;
    },
    toggleSubject(subject) {
      const index = this.formData.subjects.indexOf(subject);
      if (index > -1) {
        this.formData.subjects.splice(index, 1);
      } else {
        this.formData.subjects.push(subject);
      }
    },
    removeSubject(index) {
      this.formData.subjects.splice(index, 1);
      // 移除科目时，清空已选择的班级并重新过滤班级列表
      this.formData.classes = [];
      this.filterClasses();
    },
    confirmSubjects() {
      this.showSubjectModalFlag = false;
      // 科目变更时，清空已选择的班级并重新过滤班级列表
      this.formData.classes = [];
      this.filterClasses();
    },
    showClassModal() {
      this.showClassModalFlag = true;
      this.classSearchKeyword = '';
      this.filterClasses(); // 使用新的过滤方法，会自动应用年级过滤
    },
    closeClassModal() {
      this.showClassModalFlag = false;
      this.classSearchKeyword = '';
    },
    filterClasses() {
      let filteredList = [...this.classList];
      
      // 首先按年级过滤
      if (this.formData.grade) {
        filteredList = filteredList.filter(classItem => {
          return classItem.grade === this.formData.grade;
        });
      }
      
      // 然后按科目过滤
      if (this.formData.subjects && this.formData.subjects.length > 0) {
        filteredList = filteredList.filter(classItem => {
          const className = (classItem.className || '').toLowerCase();
          // 检查班级名称是否包含任何一个已选择的科目
          return this.formData.subjects.some(subject => {
            return className.includes(subject.toLowerCase());
          });
        });
      }
      
      // 最后按关键词搜索
      if (this.classSearchKeyword.trim()) {
        const keyword = this.classSearchKeyword.toLowerCase().trim();
        filteredList = filteredList.filter(classItem => {
          const className = (classItem.className || '').toLowerCase();
          const grade = (classItem.grade || '').toLowerCase();
          return className.includes(keyword) || grade.includes(keyword);
        });
      }
      
      this.filteredClassList = filteredList;
    },
    filterClassesByGrade() {
      // 重新过滤班级列表（不依赖搜索关键词）
      this.filterClasses();
    },
    toggleClass(classItem) {
      const index = this.formData.classes.findIndex(c => c._id === classItem._id);
      if (index > -1) {
        this.formData.classes.splice(index, 1);
      } else {
        this.formData.classes.push(classItem);
      }
    },
    removeClass(index) {
      this.formData.classes.splice(index, 1);
    },
    confirmClasses() {
      this.showClassModalFlag = false;
    },
    isClassSelected(classItem) {
      return this.formData.classes.some(c => c._id === classItem._id);
    },
    async loadClassList() {
      try {
        const res = await uniCloud.callFunction({
          name: 'class-management',
          data: {
            action: 'getClasses',
            page: 1,
            pageSize: 1000 // 获取所有班级
          }
        });
        
        if (res.result.code === 0) {
          this.classList = res.result.data;
          console.log('班级列表加载成功，数量:', this.classList.length);
          console.log('班级列表数据:', this.classList);
          this.filterClasses(); // 使用过滤方法，会自动应用年级过滤
        } else {
          console.error('加载班级列表失败:', res.result.message);
        }
      } catch (error) {
        console.error('加载班级列表失败:', error);
      }
    },
    getGradeCode(grade) {
      const gradeMap = {
        '一年级': '01', '二年级': '02', '三年级': '03', '四年级': '04', '五年级': '05', '六年级': '06',
        '七年级': '07', '八年级': '08', '九年级': '09',
        '高一': '10', '高二': '11', '高三': '12'
      };
      return gradeMap[grade] || '00';
    },
    getNameCode(name) {
      // 简单的拼音首字母生成（实际项目中建议使用专业的拼音库）
      const pinyinMap = {
        'a': 'A', 'b': 'B', 'c': 'C', 'd': 'D', 'e': 'E', 'f': 'F', 'g': 'G', 'h': 'H',
        'i': 'I', 'j': 'J', 'k': 'K', 'l': 'L', 'm': 'M', 'n': 'N', 'o': 'O', 'p': 'P',
        'q': 'Q', 'r': 'R', 's': 'S', 't': 'T', 'u': 'U', 'v': 'V', 'w': 'W', 'x': 'X',
        'y': 'Y', 'z': 'Z'
      };
      
      // 取姓名的前两个字符的拼音首字母
      let code = '';
      for (let i = 0; i < Math.min(name.length, 2); i++) {
        const char = name[i].toLowerCase();
        if (pinyinMap[char]) {
          code += pinyinMap[char];
        } else {
          // 如果不是英文字母，使用字符的ASCII码
          code += String.fromCharCode(65 + (char.charCodeAt(0) % 26));
        }
      }
      
      return code.padEnd(2, 'X');
    },
    toggleBatchMode() {
      this.isBatchMode = !this.isBatchMode;
      if (!this.isBatchMode) {
        // 退出批量模式时清空表单
        this.resetForm();
      }
    },
    resetForm() {
      this.formData = {
        name: '',
        grade: '',
        subjects: [],
        classes: [],
        school: '',
        scores: []
      };
      this.gradeIndex = 0;
    },
    async submitStudent() {
      if (!this.canSubmit) return;
      
      this.isLoading = true;
      
      try {
        const studentData = {
          name: this.formData.name.trim(),
          grade: this.formData.grade,
          subjects: this.formData.subjects,
          classes: this.formData.classes,
          classIds: this.formData.classes.map(c => c._id),
          school: this.formData.school.trim(),
          scores: this.formData.scores.filter(score => score.subject && score.score), // 只包含有效的成绩
          studentId: this.generatedStudentId,
          createTime: new Date().toISOString(),
          
        };
        
        if (this.isBatchMode) {
          // 批量模式：添加到列表
          this.batchStudents.push(studentData);
          uni.showToast({
            title: '已添加到批量列表',
            icon: 'success'
          });
          this.resetForm();
        } else {
          // 单个模式：直接提交
          await this.saveStudent(studentData);
          uni.showToast({
            title: '录入成功',
            icon: 'success'
          });
          this.resetForm();
          
          // 更新档案管理页面的本地缓存
          this.updateArchiveCache();
        }
      } catch (error) {
        console.error('提交失败:', error);
        uni.showToast({
          title: '录入失败，请重试',
          icon: 'error'
        });
      } finally {
        this.isLoading = false;
      }
    },
    // 成绩相关方法
    addScore() {
      this.formData.scores.push({
        subject: '',
        subjectIndex: 0,
        score: ''
      });
    },
    removeScore(index) {
      this.formData.scores.splice(index, 1);
    },
    onScoreSubjectChange(index, value) {
      this.formData.scores[index].subjectIndex = value;
      this.formData.scores[index].subject = this.allSubjects[value];
    },
    async saveStudent(studentData) {
      // 调用云函数保存学生数据
      const result = await uniCloud.callFunction({
        name: 'student-manager',
        data: {
          action: 'addStudent',
          studentData: studentData
        }
      });
      
      if (result.result.code !== 0) {
        throw new Error(result.result.message || '保存失败');
      }
      
      return result.result;
    },
    
    // 更新档案管理页面的本地缓存
    updateArchiveCache() {
      try {
        const app = getApp();
        if (app.globalData && app.globalData.updateArchiveCache) {
          app.globalData.updateArchiveCache();
          console.log('已通知档案管理页面更新缓存');
        } else {
          console.log('档案管理页面未加载，无法更新缓存');
        }
      } catch (error) {
        console.error('更新档案管理缓存失败:', error);
      }
    },
    editBatchStudent(index) {
      const student = this.batchStudents[index];
      this.formData = {
        name: student.name,
        grade: student.grade,
        subjects: [...student.subjects],
        classes: [...(student.classes || [])],
        school: student.school
      };
      this.gradeIndex = this.gradeOptions.indexOf(student.grade);
      this.isBatchMode = false;
    },
    removeBatchStudent(index) {
      uni.showModal({
        title: '确认删除',
        content: `确定要删除学生 ${this.batchStudents[index].name} 吗？`,
        success: (res) => {
          if (res.confirm) {
            this.batchStudents.splice(index, 1);
            uni.showToast({
              title: '已删除',
              icon: 'success'
            });
          }
        }
      });
    },
    clearBatch() {
      uni.showModal({
        title: '确认清空',
        content: '确定要清空所有学生信息吗？',
        success: (res) => {
          if (res.confirm) {
            this.batchStudents = [];
            uni.showToast({
              title: '已清空',
              icon: 'success'
            });
          }
        }
      });
    },
    async submitBatch() {
      if (this.batchStudents.length === 0) return;
      
      this.isLoading = true;
      
      try {
        const result = await uniCloud.callFunction({
          name: 'student-manager',
          data: {
            action: 'addBatchStudents',
            studentsData: this.batchStudents
          }
        });
        
        if (result.result.code === 0) {
          uni.showToast({
            title: `成功录入 ${this.batchStudents.length} 名学生`,
            icon: 'success'
          });
          this.batchStudents = [];
          this.isBatchMode = false;
          
          // 更新档案管理页面的本地缓存
          this.updateArchiveCache();
        } else {
          throw new Error(result.result.message || '批量录入失败');
        }
      } catch (error) {
        console.error('批量提交失败:', error);
        uni.showToast({
          title: '批量录入失败，请重试',
          icon: 'error'
        });
      } finally {
        this.isLoading = false;
      }
    }
  }
}
</script>

<style scoped>
.container {
  padding: 20rpx;
  background: #f8f8f8;
  min-height: 100vh;
  padding-top: 120rpx; /* 为自定义导航栏留出空间 */
}

/* 自定义导航栏样式 */
.custom-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background: #fff;
  border-bottom: 1rpx solid #e5e5e5;
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 30rpx;
  padding-top: var(--status-bar-height, 0);
}

.navbar-left {
  display: flex;
  align-items: center;
  padding: 10rpx 0;
}

.back-icon {
  font-size: 40rpx;
  color: #333;
  margin-right: 8rpx;
  font-weight: bold;
}

.back-text {
  font-size: 28rpx;
  color: #333;
}

.navbar-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.navbar-right {
  width: 100rpx;
}


.form-container {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
}

.form-item {
  margin-bottom: 30rpx;
}

.form-item:last-child {
  margin-bottom: 0;
}

.label {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  display: block;
  margin-bottom: 15rpx;
}

.input {
  width: 100%;
  height: 80rpx;
  border: 2rpx solid #e5e5e5;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  color: #333;
  box-sizing: border-box;
}

.input:focus {
  border-color: #4FC3F7;
}

.picker {
  width: 100%;
  height: 80rpx;
  border: 2rpx solid #e5e5e5;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}

.arrow {
  color: #999;
  font-size: 24rpx;
}

/* 科目选择器样式 */
.subject-selector {
  width: 100%;
  min-height: 80rpx;
  border: 2rpx solid #e5e5e5;
  border-radius: 8rpx;
  padding: 15rpx 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  background: #fff;
}

/* 班级选择器样式 */
.class-selector {
  width: 100%;
  min-height: 80rpx;
  border: 2rpx solid #e5e5e5;
  border-radius: 8rpx;
  padding: 15rpx 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  background: #fff;
}

.class-display {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.selected-classes {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
}

.class-tag {
  display: flex;
  align-items: center;
  background: #4FC3F7;
  color: #fff;
  padding: 8rpx 12rpx;
  border-radius: 6rpx;
  font-size: 24rpx;
}

.class-text {
  margin-right: 8rpx;
}

.subject-display {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.placeholder {
  font-size: 28rpx;
  color: #999;
}

.selected-subjects {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
}

.subject-tag {
  display: flex;
  align-items: center;
  background: #4FC3F7;
  color: #fff;
  padding: 8rpx 12rpx;
  border-radius: 6rpx;
  font-size: 24rpx;
}

.subject-text {
  margin-right: 8rpx;
}

.remove-btn {
  font-size: 20rpx;
  font-weight: bold;
  cursor: pointer;
}

/* 科目选择弹窗样式 */
.subject-modal,
.class-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
}

.subject-modal-content,
.class-modal-content {
  background: #fff;
  border-radius: 16rpx;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.modal-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.close-btn {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-icon {
  font-size: 32rpx;
  color: #999;
}

.modal-body {
  padding: 30rpx;
  max-height: 50vh;
  overflow-y: auto;
}

.subject-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 15rpx;
}

.search-container {
  position: relative;
  margin-bottom: 25rpx;
  background: linear-gradient(135deg, #f0f8ff 0%, #e3f2fd 100%);
  border-radius: 12rpx;
  padding: 15rpx;
  box-shadow: 0 4rpx 12rpx rgba(79, 195, 247, 0.15);
  border: 2rpx solid rgba(79, 195, 247, 0.2);
}

.search-input {
  width: 100%;
  height: 80rpx;
  border: 2rpx solid #4FC3F7;
  border-radius: 10rpx;
  padding: 0 60rpx 0 25rpx;
  font-size: 30rpx;
  color: #333;
  box-sizing: border-box;
  background: #fff;
  box-shadow: 0 2rpx 8rpx rgba(79, 195, 247, 0.1);
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: #1976D2;
  box-shadow: 0 4rpx 16rpx rgba(25, 118, 210, 0.2);
  transform: translateY(-1rpx);
}

.search-input::placeholder {
  color: #999;
  font-size: 28rpx;
}

.search-icon {
  position: absolute;
  right: 30rpx;
  top: 50%;
  transform: translateY(-50%);
  font-size: 28rpx;
  color: #4FC3F7;
  font-weight: bold;
}

.class-list {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
  max-height: 400rpx;
  overflow-y: auto;
}

.no-result {
  text-align: center;
  padding: 40rpx 20rpx;
  color: #999;
}

.no-result-text {
  font-size: 26rpx;
  color: #999;
}

.subject-item,
.class-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 25rpx;
  border: 2rpx solid #e5e5e5;
  border-radius: 8rpx;
  background: #fff;
  min-width: 200rpx;
  transition: all 0.3s;
}

.subject-item.selected,
.class-item.selected {
  border-color: #4FC3F7;
  background: #f0f8ff;
}

.subject-name {
  font-size: 28rpx;
  color: #333;
}

.class-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.class-header {
  display: flex;
  align-items: center;
  margin-bottom: 8rpx;
}

.class-name {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  margin-right: 15rpx;
}

.class-grade {
  font-size: 24rpx;
  color: #666;
  background: #f0f0f0;
  padding: 4rpx 8rpx;
  border-radius: 4rpx;
}

.class-details {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.class-subject {
  font-size: 24rpx;
  color: #4CAF50;
  background: #e8f5e8;
  padding: 2rpx 6rpx;
  border-radius: 4rpx;
  display: inline-block;
  width: fit-content;
}

.class-teacher {
  font-size: 22rpx;
  color: #666;
}

.class-student-count {
  font-size: 22rpx;
  color: #999;
}

.check-icon {
  font-size: 24rpx;
  color: #4FC3F7;
  font-weight: bold;
}

.modal-footer {
  display: flex;
  padding: 30rpx;
  gap: 20rpx;
  border-top: 1rpx solid #f0f0f0;
}

.cancel-btn,
.confirm-btn {
  flex: 1;
  height: 80rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
  font-weight: bold;
  border: none;
}

.cancel-btn {
  background: #f0f0f0;
  color: #666;
}

.confirm-btn {
  background: #4FC3F7;
  color: #fff;
}

.preview-section {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
}

.preview-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 20rpx;
}

.student-preview {
  border: 2rpx solid #e5e5e5;
  border-radius: 12rpx;
  padding: 20rpx;
  background: #fafafa;
}

.student-card {
  display: flex;
  align-items: center;
}

.student-info {
  flex: 1;
}

.student-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 8rpx;
}

.student-id {
  font-size: 26rpx;
  color: #4FC3F7;
  font-weight: 500;
  display: block;
  margin-bottom: 5rpx;
}

.student-grade,
.student-subjects,
.student-classes,
.student-school {
  font-size: 24rpx;
  color: #666;
  display: block;
  margin-bottom: 3rpx;
}

.preview-placeholder {
  text-align: center;
  padding: 40rpx;
  color: #999;
  font-size: 26rpx;
}

.button-container {
  margin-bottom: 30rpx;
}

.submit-btn {
  width: 100%;
  height: 88rpx;
  background: #4FC3F7;
  color: #fff;
  border: none;
  border-radius: 12rpx;
  font-size: 32rpx;
  font-weight: bold;
}

.submit-btn:disabled {
  background: #ccc;
}

.batch-mode {
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
}

.batch-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
  background: #f8f9fa;
}

.batch-text {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.batch-icon {
  font-size: 32rpx;
  color: #4FC3F7;
  font-weight: bold;
}

.batch-container {
  padding: 30rpx;
}

.batch-info {
  margin-bottom: 20rpx;
}

.batch-info text {
  font-size: 26rpx;
  color: #666;
}

.batch-list {
  margin-bottom: 20rpx;
}

.batch-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx;
  border: 1rpx solid #e5e5e5;
  border-radius: 8rpx;
  margin-bottom: 15rpx;
  background: #fafafa;
}

.batch-student-info {
  flex: 1;
}

.batch-name {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  display: block;
  margin-bottom: 5rpx;
}

.batch-id {
  font-size: 24rpx;
  color: #666;
}

.batch-actions {
  display: flex;
  gap: 15rpx;
}

.batch-edit-btn,
.batch-delete-btn {
  padding: 10rpx 20rpx;
  border-radius: 6rpx;
  font-size: 24rpx;
  border: none;
}

.batch-edit-btn {
  background: #4FC3F7;
  color: #fff;
}

.batch-delete-btn {
  background: #ff6b6b;
  color: #fff;
}

.batch-clear-btn,
.batch-submit-btn {
  width: 100%;
  height: 80rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
  font-weight: bold;
  border: none;
  margin-bottom: 15rpx;
}

.batch-clear-btn {
  background: #ff6b6b;
  color: #fff;
}

.batch-submit-btn {
  background: #4FC3F7;
  color: #fff;
}

.batch-submit-btn:disabled {
  background: #ccc;
}

/* 成绩录入样式 */
.score-input-container {
  margin-top: 20rpx;
}

.score-item {
  background: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  border: 1rpx solid #e5e5e5;
}

.score-subject,
.score-value {
  display: flex;
  align-items: center;
  margin-bottom: 15rpx;
}

.score-label {
  font-size: 26rpx;
  color: #666;
  width: 120rpx;
  flex-shrink: 0;
}

.score-picker {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15rpx 20rpx;
  background: #f8f8f8;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #333;
}

.score-input {
  flex: 1;
  padding: 15rpx 20rpx;
  background: #f8f8f8;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #333;
  border: none;
}

.score-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10rpx;
}

.remove-score-btn {
  color: #ff6b6b;
  font-size: 24rpx;
  padding: 8rpx 16rpx;
  background: #fff5f5;
  border-radius: 6rpx;
  border: 1rpx solid #ff6b6b;
}

.add-score-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20rpx;
  background: #f0f8ff;
  border: 2rpx dashed #4FC3F7;
  border-radius: 12rpx;
  margin-top: 10rpx;
}

.add-score-text {
  color: #4FC3F7;
  font-size: 28rpx;
  font-weight: bold;
}
</style>
