<template>
  <view class="container">
    <!-- 自定义导航栏 -->
    <view class="custom-navbar">
      <view class="navbar-content">
        <view class="navbar-left" @click="goBack">
          <text class="back-icon">‹</text>
          <text class="back-text">返回</text>
        </view>
        <text class="navbar-title">班级详情</text>
        <view class="navbar-right"></view>
      </view>
    </view>
    
    <view class="form-container" v-if="classData">
      <view class="form-item">
        <text class="label">班级名称 *</text>
        <input 
          class="input" 
          v-model="classData.className" 
          placeholder="请输入班级名称"
          maxlength="30"
        />
      </view>
      
      <view class="form-item">
        <text class="label">年级</text>
        <input 
          class="input" 
          v-model="classData.grade" 
          placeholder="请输入年级"
          maxlength="20"
        />
      </view>
      
      <view class="form-item">
        <text class="label">教师</text>
        <view class="teacher-selector" @click="showTeacherModal">
          <view class="teacher-display">
            <text v-if="!classData.teacherName" class="placeholder">请选择教师（可选）</text>
            <view v-else class="selected-teacher">
              <text class="teacher-text">{{ classData.teacherName }}</text>
            </view>
          </view>
          <text class="arrow">></text>
        </view>
      </view>
      
      <!-- 班级学生列表 -->
      <view class="form-item">
        <view class="label-container">
          <text class="label">班级学生</text>
          <view class="add-student-container">
            <button class="add-student-btn" @click="showAddStudentModal">
              <text class="add-btn-text">+ 添加学生</text>
            </button>
          </view>
        </view>
        <view class="student-list-container">
          <view 
            v-for="(student, index) in classData.students" 
            :key="student._id"
            class="student-item"
          >
            <view class="student-info">
              <text class="student-name">{{ student.name }}</text>
              <text class="student-id">{{ student.studentId }}</text>
            </view>
            <text class="remove-student-btn" @click="removeStudentFromClass(student)">移除</text>
          </view>
          <view v-if="!classData.students || classData.students.length === 0" class="no-students">
            <text class="no-students-text">暂无学生</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 删除班级按钮 -->
    <view class="delete-button-container">
      <image class="delete-btn" src="/static/删除 .png" mode="aspectFit" @click="deleteClass"></image>
    </view>
    
    <!-- 老师选择弹窗 -->
    <view v-if="showTeacherModalFlag" class="teacher-modal" @click="closeTeacherModal">
      <view class="teacher-modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">选择班主任</text>
          <view class="close-btn" @click="closeTeacherModal">
            <text class="close-icon">×</text>
          </view>
        </view>
        
        <view class="modal-body">
          <view class="search-container">
            <input 
              class="search-input" 
              v-model="teacherSearchKeyword" 
              placeholder="搜索老师姓名" 
              @input="onTeacherSearchInput"
            />
          </view>
          
          <view class="teacher-list">
            <view 
              v-for="teacher in filteredTeachers" 
              :key="teacher._id"
              class="teacher-item"
              :class="{selected: isSelectedTeacher(teacher)}"
              @click="selectTeacher(teacher)"
            >
              <text class="teacher-name">{{ teacher.teacherName || teacher.username }}</text>
              <text v-if="isSelectedTeacher(teacher)" class="check-icon">✓</text>
            </view>
            
            <view v-if="filteredTeachers.length === 0" class="empty-teacher-tip">
              <text class="empty-text">暂无匹配的老师</text>
            </view>
          </view>
        </view>
        
        <view class="modal-footer">
          <button class="cancel-btn" @click="closeTeacherModal">取消</button>
          <button class="confirm-btn" @click="confirmTeacher">确定</button>
        </view>
      </view>
    </view>
    
    <!-- 添加学生弹窗 -->
    <view v-if="showAddStudentModalFlag" class="add-student-modal" @click="closeAddStudentModal">
      <view class="add-student-modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">添加学生到班级</text>
          <view class="close-btn" @click="closeAddStudentModal">
            <text class="close-icon">×</text>
          </view>
        </view>
        
        <view class="modal-body">
          <view class="search-container">
            <input 
              class="search-input" 
              v-model="studentSearchKeyword" 
              placeholder="搜索学生姓名或学号" 
              @input="onStudentSearchInput"
            />
          </view>
          
          <view class="student-selection-list">
            <view 
              v-for="student in filteredStudents" 
              :key="student._id"
              class="student-selection-item"
              :class="{selected: isStudentSelected(student)}"
              @click="selectStudent(student)"
            >
              <view class="student-avatar">
                <text class="avatar-text">{{ (student.name || '学').charAt(0) }}</text>
              </view>
              <view class="student-info">
                <text class="student-name">{{ student.name }}</text>
                <text class="student-details">{{ student.studentId }} · {{ student.grade }}</text>
              </view>
              <view v-if="isStudentSelected(student)" class="selection-indicator">
                <text class="check-icon">✓</text>
              </view>
            </view>
            
            <view v-if="filteredStudents.length === 0" class="no-result">
              <text class="no-result-text">暂无匹配的学生</text>
            </view>
          </view>
        </view>
        
        <view class="modal-footer">
          <button class="cancel-btn" @click="closeAddStudentModal">取消</button>
          <button class="confirm-btn" @click="addSelectedStudentsToClass" :disabled="selectedStudents.length === 0">
            添加 ({{ selectedStudents.length }})
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      classData: null,
      originalClassData: null,
      showTeacherModalFlag: false,
      availableTeachers: [],
      teacherSearchKeyword: '',
      filteredTeachers: [],
      tempTeacher: null,
      showAddStudentModalFlag: false,
      availableStudents: [],
      studentSearchKeyword: '',
      filteredStudents: [],
      selectedStudents: []
    }
  },
  computed: {
    canSubmit() {
      return this.classData && 
             this.classData.className.trim();
    }
  },
  onLoad(options) {
    if (options.classId) {
      this.loadClassDetail(options.classId);
    }
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    async loadClassDetail(classId) {
      try {
        const result = await uniCloud.callFunction({
          name: 'archive-manager',
          data: {
            action: 'getClassDetail',
            classId: classId
          }
        });
        
        if (result.result.code === 0) {
          this.classData = result.result.data;
          this.originalClassData = JSON.parse(JSON.stringify(result.result.data));
          
          // 只加载老师列表，学生列表在需要时再加载
          this.loadAvailableTeachers();
        } else {
          uni.showToast({
            title: '加载班级信息失败',
            icon: 'error'
          });
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        }
      } catch (error) {
        console.error('加载班级详情失败:', error);
        uni.showToast({
          title: '加载班级信息失败',
          icon: 'error'
        });
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      }
    },
    async loadAvailableTeachers() {
      try {
        const result = await uniCloud.callFunction({
          name: 'archive-manager',
          data: {
            action: 'getTeachers'
          }
        });
        
        if (result.result.code === 0) {
          this.availableTeachers = result.result.data || [];
          this.filteredTeachers = this.availableTeachers;
        }
      } catch (error) {
        console.error('加载老师列表失败:', error);
        uni.showToast({
          title: '加载老师列表失败',
          icon: 'error'
        });
      }
    },
    showTeacherModal() {
      this.tempTeacher = this.classData.teacherId ? 
        this.availableTeachers.find(t => t._id === this.classData.teacherId) : null;
      this.showTeacherModalFlag = true;
      this.filteredTeachers = this.availableTeachers;
      this.teacherSearchKeyword = '';
    },
    closeTeacherModal() {
      this.showTeacherModalFlag = false;
    },
    onTeacherSearchInput() {
      if (!this.teacherSearchKeyword) {
        this.filteredTeachers = this.availableTeachers;
        return;
      }
      
      const keyword = this.teacherSearchKeyword.toLowerCase();
      this.filteredTeachers = this.availableTeachers.filter(teacher => {
        const name = teacher.teacherName || teacher.username || '';
        return name.toLowerCase().includes(keyword);
      });
    },
    isSelectedTeacher(teacher) {
      return this.tempTeacher && this.tempTeacher._id === teacher._id;
    },
    selectTeacher(teacher) {
      this.tempTeacher = teacher;
    },
    confirmTeacher() {
      if (this.tempTeacher) {
        this.classData.teacherId = this.tempTeacher._id;
        this.classData.teacherName = this.tempTeacher.teacherName || this.tempTeacher.username;
      } else {
        this.classData.teacherId = '';
        this.classData.teacherName = '';
      }
      this.showTeacherModalFlag = false;
    },
    async loadAvailableStudents() {
      try {
        // 只在需要时加载学生列表，并限制数据量
        const result = await uniCloud.callFunction({
          name: 'archive-manager',
          data: {
            action: 'getStudents',
            page: 1,
            pageSize: 100 // 限制每次加载100条学生数据
          }
        });
        
        if (result.result.code === 0) {
          this.availableStudents = result.result.data || [];
          this.filteredStudents = this.availableStudents;
        }
      } catch (error) {
        console.error('加载学生列表失败:', error);
        uni.showToast({
          title: '加载学生列表失败',
          icon: 'error'
        });
      }
    },
    async showAddStudentModal() {
      this.showAddStudentModalFlag = true;
      this.selectedStudents = [];
      this.studentSearchKeyword = '';
      
      // 只在弹窗打开时才加载学生数据
      if (this.availableStudents.length === 0) {
        await this.loadAvailableStudents();
      } else {
        this.filteredStudents = this.availableStudents;
      }
    },
    closeAddStudentModal() {
      this.showAddStudentModalFlag = false;
      this.selectedStudents = [];
      this.studentSearchKeyword = '';
    },
    onStudentSearchInput() {
      if (!this.studentSearchKeyword) {
        this.filteredStudents = this.availableStudents;
        return;
      }
      
      const keyword = this.studentSearchKeyword.toLowerCase();
      this.filteredStudents = this.availableStudents.filter(student => {
        const name = student.name || '';
        const studentId = student.studentId || '';
        return name.toLowerCase().includes(keyword) || 
               studentId.toLowerCase().includes(keyword);
      });
    },
    isStudentSelected(student) {
      return this.selectedStudents.some(s => s._id === student._id);
    },
    selectStudent(student) {
      const index = this.selectedStudents.findIndex(s => s._id === student._id);
      if (index > -1) {
        this.selectedStudents.splice(index, 1);
      } else {
        this.selectedStudents.push(student);
      }
    },
    async addSelectedStudentsToClass() {
      if (this.selectedStudents.length === 0) return;
      
      try {
        const result = await uniCloud.callFunction({
          name: 'class-management',
          data: {
            action: 'addStudentsToClass',
            classId: this.classData._id,
            studentIds: this.selectedStudents.map(s => s.studentId)
          }
        });
        
        if (result.result.code === 0) {
          uni.showToast({
            title: '添加学生成功',
            icon: 'success'
          });
          
          // 重新加载班级详情
          this.loadClassDetail(this.classData._id);
          this.closeAddStudentModal();
        } else {
          throw new Error(result.result.message || '添加学生失败');
        }
      } catch (error) {
        console.error('添加学生失败:', error);
        uni.showToast({
          title: '添加学生失败，请重试',
          icon: 'error'
        });
      }
    },
    async removeStudentFromClass(student) {
      uni.showModal({
        title: '确认移除',
        content: `确定要从班级中移除学生 ${student.name} 吗？`,
        success: async (res) => {
          if (res.confirm) {
            try {
              const result = await uniCloud.callFunction({
                name: 'class-management',
                data: {
                  action: 'removeStudentFromClass',
                  classId: this.classData._id,
                  studentId: student.studentId
                }
              });
              
              if (result.result.code === 0) {
                uni.showToast({
                  title: '移除学生成功',
                  icon: 'success'
                });
                
                // 重新加载班级详情
                this.loadClassDetail(this.classData._id);
              } else {
                throw new Error(result.result.message || '移除学生失败');
              }
            } catch (error) {
              console.error('移除学生失败:', error);
              uni.showToast({
                title: '移除学生失败，请重试',
                icon: 'error'
              });
            }
          }
        }
      });
    },
    async updateClass() {
      if (!this.canSubmit) return;
      
      try {
        const updateData = {
          classId: this.classData._id,
          className: this.classData.className.trim(),
          grade: this.classData.grade.trim(),
          teacherId: this.classData.teacherId,
          teacherName: this.classData.teacherName
        };
        
        const result = await uniCloud.callFunction({
          name: 'archive-manager',
          data: {
            action: 'updateClass',
            classData: updateData
          }
        });
        
        if (result.result.code === 0) {
          uni.showToast({
            title: '更新成功',
            icon: 'success'
          });
          
          // 更新档案管理页面的本地缓存
          this.updateArchiveCache();
          
          // 返回档案管理页面并刷新
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        } else {
          throw new Error(result.result.message || '更新失败');
        }
      } catch (error) {
        console.error('更新班级信息失败:', error);
        uni.showToast({
          title: '更新失败，请重试',
          icon: 'error'
        });
      }
    },
    deleteClass() {
      uni.showModal({
        title: '确认删除',
        content: `确定要删除班级 ${this.classData.className} 吗？`,
        success: async (res) => {
          if (res.confirm) {
            try {
              const result = await uniCloud.callFunction({
                name: 'archive-manager',
                data: {
                  action: 'deleteClass',
                  classId: this.classData._id
                }
              });
              
              if (result.result.code === 0) {
                uni.showToast({
                  title: '删除成功',
                  icon: 'success'
                });
                
                // 返回档案管理页面并刷新
                setTimeout(() => {
                  uni.navigateBack();
                }, 1500);
              } else {
                throw new Error(result.result.message || '删除失败');
              }
            } catch (error) {
              console.error('删除班级失败:', error);
              uni.showToast({
                title: '删除失败，请重试',
                icon: 'error'
              });
            }
          }
        }
      });
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
  border-color: #9C27B0;
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

/* 老师选择器样式 */
.teacher-selector {
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

.teacher-display {
  flex: 1;
  display: flex;
  align-items: center;
}

.placeholder {
  font-size: 28rpx;
  color: #999;
}

.selected-teacher {
  display: flex;
  align-items: center;
  background: #9C27B0;
  color: #fff;
  padding: 8rpx 12rpx;
  border-radius: 6rpx;
  font-size: 24rpx;
}

.teacher-text {
  margin-right: 8rpx;
}

/* 学生列表样式 */
.label-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15rpx;
}

.add-student-container {
  display: flex;
  justify-content: flex-end;
}

.add-student-btn {
  background: #4FC3F7;
  color: #fff;
  border: none;
  border-radius: 6rpx;
  padding: 8rpx 16rpx;
  font-size: 24rpx;
}

.add-btn-text {
  color: #fff;
}

.student-list-container {
  width: 100%;
  min-height: 80rpx;
  border: 2rpx solid #e5e5e5;
  border-radius: 8rpx;
  padding: 15rpx 20rpx;
  box-sizing: border-box;
  background: #fafafa;
}

.student-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10rpx 0;
  border-bottom: 1rpx solid #eee;
}

.student-item:last-child {
  border-bottom: none;
}

.student-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.student-name {
  font-size: 26rpx;
  color: #fff;
  background: #9C27B0;
  padding: 2rpx 6rpx;
  border-radius: 3rpx;
  margin-bottom: 3rpx;
  display: inline-block;
  width: fit-content;
}

.student-id {
  font-size: 24rpx;
  color: #999;
}

.remove-student-btn {
  color: #ff6b6b;
  font-size: 24rpx;
  padding: 8rpx 12rpx;
  border-radius: 4rpx;
  background: #fff5f5;
}

.no-students {
  text-align: center;
  padding: 20rpx 0;
}

.no-students-text {
  font-size: 26rpx;
  color: #999;
}

/* 老师选择弹窗样式 */
.teacher-modal {
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

.teacher-modal-content {
  background: #fff;
  border-radius: 16rpx;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
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
  padding: 20rpx 30rpx;
  overflow-y: auto;
  flex: 1;
}

/* 搜索框样式 */
.search-container {
  padding: 0 0 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.search-input {
  width: 100%;
  height: 70rpx;
  border: 2rpx solid #e5e5e5;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  color: #333;
  box-sizing: border-box;
}

.search-input:focus {
  border-color: #9C27B0;
}

.teacher-list {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
  padding: 10rpx 0;
}

.teacher-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx;
  border: 2rpx solid #e5e5e5;
  border-radius: 8rpx;
  background: #fff;
  transition: all 0.3s;
}

.teacher-item.selected {
  border-color: #9C27B0;
  background: #f3e5f5;
}

.teacher-name {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
}

.check-icon {
  font-size: 24rpx;
  color: #9C27B0;
  font-weight: bold;
}

/* 空老师提示样式 */
.empty-teacher-tip {
  padding: 40rpx;
  text-align: center;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
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
  background: #9C27B0;
  color: #fff;
}

/* 删除按钮容器 */
.delete-button-container {
  position: fixed;
  bottom: 30rpx;
  right: 30rpx;
  z-index: 100;
}

.delete-btn {
  width: 100rpx;
  height: 100rpx;
  transition: all 0.3s ease;
}

.delete-btn:active {
  transform: scale(0.95);
}

/* 添加学生弹窗样式 */
.add-student-modal {
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

.add-student-modal-content {
  background: #fff;
  border-radius: 16rpx;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.student-selection-list {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
  padding: 10rpx 0;
}

.student-selection-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  border: 2rpx solid #e5e5e5;
  border-radius: 8rpx;
  background: #fff;
  transition: all 0.3s;
}

.student-selection-item.selected {
  border-color: #4FC3F7;
  background: #f0f8ff;
}

.student-avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: #4FC3F7;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
}

.avatar-text {
  font-size: 24rpx;
  color: #fff;
  font-weight: bold;
}

.student-details {
  font-size: 24rpx;
  color: #999;
  margin-top: 3rpx;
}

.selection-indicator {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: #4FC3F7;
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-icon {
  font-size: 20rpx;
  color: #fff;
  font-weight: bold;
}

.no-result {
  padding: 40rpx;
  text-align: center;
}

.no-result-text {
  font-size: 28rpx;
  color: #999;
}
</style>