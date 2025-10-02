<template>
  <view class="teacher-schedule-page">
    <!-- 固定返回按钮 -->
    <view class="back-btn-fixed">
      <button class="back-btn" @click="goHome">
        <text class="back-btn-icon">🏠</text>
      </button>
    </view>
    
    <!-- <view style="font-size:32rpx;color:#1976D2;font-weight:bold;margin:40rpx 0 30rpx 0;text-align:center;">这里是教师排课页面</view> -->
    <view class="main-content">
        <view class="title-bar">
          <view class="page-title">教师排课管理</view>
        </view>

        <view class="form-section card-bg">
          <view class="form-title">搜索并选择教师</view>
          <input class="search-input" v-model.trim="searchKeyword" placeholder="🔍 输入教师姓名" />
          <scroll-view scroll-y class="teacher-list-scroll">
            <view v-for="(teacher, idx) in filteredTeacherList" :key="teacher.username" class="teacher-item" @click="selectTeacher(idx)">
              <text :class="['teacher-name', idx === teacherIndex ? 'selected' : '']">{{ teacher.teacherName }}</text>
            </view>
          </scroll-view>
        </view>

        <view v-if="selectedTeacher" class="card-bg courses-section">
          <view class="results-title">{{ selectedTeacher.teacherName }} {{ weekTitle }}</view>
          <view class="week-nav">
            <button class="week-btn" @click="changeWeek(-1)">上一周</button>
            <text class="week-range">{{ weekRangeText }}</text>
            <button class="week-btn" @click="changeWeek(1)">下一周</button>
          </view>
          <view v-if="isLoading" class="loading-text">课程加载中...</view>
          <view v-else>
            <!-- 只保留每一天的详细排课，不再渲染多余的日期和星期 -->
            <view v-for="(day, idx) in weekSchedule" :key="day.course_date" class="day-schedule-block">
              <view class="day-date">{{ formatDateWithWeek(day.course_date) }}</view>
              <view class="day-courses">
                <view v-for="i in periods" :key="i" class="course-row-vertical">
                  <view class="course-label-row">
                    {{ periodTimes[i-1] }}{{ (i === 5 || i === 6) ? '（习惯班）' : '' }}
                  </view>
                  <view class="course-inputs-row">
                    <!-- 第5和第6个时间段的特殊布局 -->
                    <template v-if="i === 5 || i === 6">
                      <!-- 课程名输入框 -->
                      <input :class="['course-input', day['course_slot_' + i] ? 'has-content' : '']" v-model="day['course_slot_' + i]" @focus="onInputFocus" @input="onInputChange($event, idx, i, '')" placeholder="课程名" />
                      <!-- 班级选择器 -->
                      <picker class="class-picker" @change="onClassOptionChange($event, idx, i)" :value="getClassOptionIndex(day['course_slot_' + i + '_class'])" :range="courseOptions">
                        <view class="class-display">
                          <text>{{ day['course_slot_' + i + '_class'] || '课程名' }}</text>
                          <text class="class-arrow">▼</text>
                        </view>
                      </picker>
                      <!-- 教室输入框 -->
                      <input :class="['course-input', 'location-input', day['course_slot_' + i + '_location'] ? 'has-content' : '']" v-model="day['course_slot_' + i + '_location']" @focus="onInputFocus" @input="onInputChange($event, idx, i, 'location')" placeholder="教室" />
                      <!-- 班型选择器 -->
                      <picker class="type-picker" @change="onTypeChange($event, idx, i)" :value="getTypeIndex(day['course_slot_' + i + '_type'])" :range="courseTypes">
                        <view class="type-display">
                          <text>{{ day['course_slot_' + i + '_type'] || '无' }}</text>
                          <text class="type-arrow">▼</text>
                        </view>
                      </picker>
                    </template>
                    <!-- 其他时间段的原有布局 -->
                    <template v-else>
                      <input :class="['course-input', day['course_slot_' + i] ? 'has-content' : '']" v-model="day['course_slot_' + i]" @focus="onInputFocus" @input="onInputChange($event, idx, i, '')" placeholder="课程名" />
                      <input :class="['course-input', 'class-input', day['course_slot_' + i + '_class'] ? 'has-content' : '']" v-model="day['course_slot_' + i + '_class']" @focus="onInputFocus" @input="onInputChange($event, idx, i, 'class')" placeholder="班级" />
                      <input :class="['course-input', 'location-input', day['course_slot_' + i + '_location'] ? 'has-content' : '']" v-model="day['course_slot_' + i + '_location']" @focus="onInputFocus" @input="onInputChange($event, idx, i, 'location')" placeholder="教室" />
                      <picker class="type-picker" @change="onTypeChange($event, idx, i)" :value="getTypeIndex(day['course_slot_' + i + '_type'])" :range="courseTypes">
                        <view class="type-display">
                          <text>{{ day['course_slot_' + i + '_type'] || '无' }}</text>
                          <text class="type-arrow">▼</text>
                        </view>
                      </picker>
                    </template>
                  </view>
                  <!-- 第5和第6个时间段不显示备注输入框 -->
                  <template v-if="i !== 5 && i !== 6">
                    <view v-if="day['course_slot_' + i + '_remark']" class="course-remark-show">备注：{{ day['course_slot_' + i + '_remark'] }}</view>
                    <view class="course-remark-row">
                      <input :class="['course-remark-input', day['course_slot_' + i + '_remark'] ? 'has-content' : '']" v-model="day['course_slot_' + i + '_remark']" @focus="onInputFocus" @input="onInputChange($event, idx, i, 'remark')" placeholder="备注（可选）" />
                    </view>
                  </template>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="save-btn-fixed">
          <button class="save-btn" @click="saveSchedule"><text class="icon">💾</text>保存排课</button>
        </view>
    </view>
  </view>
</template>

<script>
import { getCourseColor } from '../../utils/courseColor.js';

function getMonday(date) {
  const d = new Date(date)
  // 始终返回本周一（周一到周日为一组），绝不包含上周日
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  d.setHours(0,0,0,0);
  return d;
}
function formatDate(d) {
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}
export default {
  data() {
    return {
      allTeacherList: [],
      teacherIndex: -1,
      searchKeyword: '',
      selectedTeacher: null,
      rawScheduleList: [], // Hold the raw schedule list from the cloud
      weekSchedule: [], // This will hold the 7-day schedule for display and editing
      isLoading: false,
      weekOffset: 0,
      initialScheduleState: '', // To check for changes
      courseTypes: ['无', '一对一', '班课', '脱产生', '习惯班'],
      courseOptions: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '七年级', '八年级', '九年级', '高一', '背诵'],
      periods: [1, 2, 3, 4, 5, 6], // 节次数组
      periodTimes: [
        '8:00-10:00',
        '10:10-12:10',
        '14:00-16:00',
        '16:10-18:10',
        '18:00-20:00',
        '20:00-22:00'
      ],
      weekDaysOrder: [1, 2, 3, 4, 5, 6, 0], // 周一到周日
      currentDate: (function() {
        const now = new Date();
        now.setHours(0,0,0,0);
        let dayOfWeek = now.getDay();
        let day = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        now.setDate(now.getDate() - day);
        return now;
      })(),
    };
  },
  computed: {
    filteredTeacherList() {
      if (!this.searchKeyword) {
        return this.allTeacherList;
      }
      return this.allTeacherList.filter(teacher =>
        teacher.teacherName && teacher.teacherName.toLowerCase().includes(this.searchKeyword.toLowerCase())
      );
    },
    weekTitle() {
      return '这周课程';
    },
    weekRangeText() {
      const monday = this.getMondayOfWeek();
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      return `${formatDate(monday)} ~ ${formatDate(sunday)}`;
    }
  },
  watch: {
    weekSchedule: {
      handler(newVal) {
        // 当 weekSchedule 发生变化时，自动保存到缓存
        if (this.selectedTeacher && newVal.length > 0) {
          const teacherId = this.selectedTeacher._id;
          const monday = this.getMondayOfWeek(this.currentDate);
          const weekKey = formatDate(monday);
          const cacheKey = 'teacherScheduleCache_' + teacherId + '_' + weekKey;
          uni.setStorageSync(cacheKey, newVal);
          console.log('数据已自动保存到缓存');
        }
      },
      deep: true
    }
  },
  onShow() {
    console.log('📱 页面显示，开始初始化...');
    
    // 获取用户信息
    const userInfo = uni.getStorageSync('userInfo');
    let teacherId = '';
    
    // 检查是否有选中的教师
    if (this.selectedTeacher && this.selectedTeacher._id) {
      teacherId = this.selectedTeacher._id;
      console.log('👤 使用已选中的教师ID:', teacherId);
    } else if (userInfo && userInfo._id) {
      teacherId = userInfo._id;
      console.log('👤 使用当前用户ID作为教师ID:', teacherId);
    }
    
    console.log('👤 当前教师ID:', teacherId);
    
    // 设置当前日期为本周一
    this.currentDate = this.getMondayOfWeek(new Date());
    const monday = this.currentDate;
    const weekKey = formatDate(monday);
    
    console.log('📅 当前周:', weekKey);
    
    // 检查是否有缓存数据
    const cacheKey = 'teacherScheduleCache_' + teacherId + '_' + weekKey;
    const cached = uni.getStorageSync(cacheKey);
    
    if (cached && Array.isArray(cached) && cached.length === 7) {
      console.log('📦 发现缓存数据，长度:', cached.length);
      // 如果有缓存数据，先使用缓存，然后异步更新
      this.weekSchedule = cached;
      
      // 异步获取最新数据
      setTimeout(() => {
        if (this.selectedTeacher) {
          console.log('🔄 异步更新数据...');
          this.fetchTeacherSchedule();
        }
      }, 100);
    } else {
      console.log('🆕 无缓存数据，构建新的周计划');
      this.buildWeekSchedule();
    }
    
    // 检查权限并获取教师列表
    this.checkAdminRoleAndFetchTeachers();
  },
  onUnload() {
    const fromService = uni.getStorageSync('fromService');
    if (fromService) {
      uni.switchTab({ url: '/pages/service/service' });
      uni.removeStorageSync('fromService');
    }
  },
  methods: {
    checkAdminRoleAndFetchTeachers() {
      const userInfo = uni.getStorageSync('userInfo');
      const isAdmin = (userInfo && userInfo.role && userInfo.role.includes('管理员')) || userInfo.permission === '管理员';
      const isSuperAdmin = userInfo && userInfo.permission === 'superadmin';
      const hasScheduleFeature = userInfo && userInfo.featureList && userInfo.featureList.includes('schedule');
      if (isAdmin || isSuperAdmin || hasScheduleFeature) {
        this.fetchTeachers();
      } else {
        uni.showToast({ title: '无权限访问', icon: 'none' });
        setTimeout(() => {
          uni.reLaunch({ url: '/pages/home/home' });
        }, 1200);
        return;
      }
    },
    fetchTeachers() {
      uniCloud.callFunction({
        name: 'user-center',
        data: { action: 'get-accounts' },
        success: async (res) => {
          const result = res.result;
          if (result.code === 200 && result.data) {
            // Also filter for users with the '教师' role here
            this.allTeacherList = result.data.filter(acc => acc.role && acc.role.includes('教师'));
            
            // 为每个教师获取openid信息
            await this.enrichTeachersWithOpenid();
            
             if (this.allTeacherList.length > 0) {
                this.selectTeacher(0);
            } else {
				uni.showToast({ title: '暂无教师信息', icon: 'none' });
			}
          } else {
            uni.showToast({ title: '获取教师列表失败: ' + (result.message || '未知错误'), icon: 'none' });
          }
        },
        fail: (err) => {
          uni.showToast({ title: '获取教师列表请求失败', icon: 'none' });
        }
      });
    },
    
    // 为教师列表补充openid信息
    async enrichTeachersWithOpenid() {
      try {
        console.log('🔍 开始补充教师openid信息...');
        
        for (let i = 0; i < this.allTeacherList.length; i++) {
          const teacher = this.allTeacherList[i];
          try {
            // 调用云函数获取用户详细信息（包含openid）
            const userResult = await uniCloud.callFunction({
              name: 'user-center',
              data: {
                action: 'get-user-detail',
                params: { userId: teacher._id }
              }
            });
            
            if (userResult.result && userResult.result.code === 200) {
              const userDetail = userResult.result.data;
              if (userDetail.openid) {
                this.allTeacherList[i].openid = userDetail.openid;
                console.log(`✅ 教师 ${teacher.teacherName || teacher.username} openid 获取成功`);
              } else {
                console.log(`⚠️ 教师 ${teacher.teacherName || teacher.username} 没有openid`);
              }
            }
          } catch (error) {
            console.error(`❌ 获取教师 ${teacher.teacherName || teacher.username} openid 失败:`, error);
          }
        }
        
        console.log('✅ 教师openid信息补充完成');
      } catch (error) {
        console.error('❌ 补充教师openid信息失败:', error);
      }
    },
    selectTeacher(idx) {
      console.log('👤 选择教师，索引:', idx);
      this.teacherIndex = idx;
      this.selectedTeacher = this.filteredTeacherList[idx];
      console.log('选中的教师:', this.selectedTeacher);
      
      // 重置当前日期为本周一
      this.currentDate = this.getMondayOfWeek(new Date());
      
      // 清空之前的数据和缓存
      this.rawScheduleList = [];
      this.weekSchedule = [];
      this.initialScheduleState = '';
      
      console.log('🔄 开始获取选中教师的课表...');
      this.fetchTeacherSchedule();
    },
    fetchTeacherSchedule() {
      if (!this.selectedTeacher) return;
      this.isLoading = true;
      
      // 确保使用正确的教师ID
      const teacherId = this.selectedTeacher._id;
      const monday = this.getMondayOfWeek();
      const sunday = new Date( monday );
      sunday.setDate(monday.getDate() + 6);
      
      console.log('🔍 开始获取教师课表数据...');
      console.log('选中的教师:', this.selectedTeacher);
      console.log('教师ID:', teacherId);
      console.log('查询日期范围:', formatDate(monday), '到', formatDate(sunday));
      
      uniCloud.callFunction({
        name: 'schedule-center',
        data: {
          action: 'getSchedulesByTeacher',
          params: {
            teacher_id: teacherId,
            startDate: formatDate(monday),
            endDate: formatDate(sunday)
          }
        },
        success: (res) => {
          console.log('📡 云函数返回结果:', res);
          const result = res.result;
          if (result.code === 200 && result.data) {
            console.log('✅ 获取课表数据成功，数据条数:', result.data.length);
            console.log('原始数据:', result.data);
            this.rawScheduleList = result.data;
            
            // 强制重新构建周计划，不使用缓存
            this.buildWeekSchedule();
            
            // 保存到缓存（用于后续编辑）
            const weekKey = formatDate(monday);
            const cacheKey = 'teacherScheduleCache_' + teacherId + '_' + weekKey;
            uni.setStorageSync(cacheKey, this.weekSchedule);
            console.log('✅ 新数据已保存到缓存');
          } else {
            console.error('❌ 获取课表数据失败:', result.message || '未知错误');
            this.rawScheduleList = [];
            this.buildWeekSchedule();
          }
        },
        fail: (err) => {
          console.error('❌ 请求失败:', err);
          this.rawScheduleList = [];
          this.buildWeekSchedule();
        },
        complete: () => {
          this.isLoading = false;
          console.log('🏁 课表获取完成');
        }
      });
    },
    buildWeekSchedule() {
      // 强制 currentDate 归到本周一
      this.currentDate = this.getMondayOfWeek(this.currentDate);
      const monday = this.currentDate;
      console.log('🔨 开始构建周计划...');
      console.log('当前日期:', this.currentDate);
      console.log('周一日期:', monday);
      console.log('原始数据列表:', this.rawScheduleList);
      
      this.weekSchedule = [];
      const newWeekSchedule = [];
      
      for (let i = 0; i < 7; i++) {
        const d = new Date(monday.getTime() + i * 24 * 60 * 60 * 1000);
        const dateStr = formatDate(d);
        console.log(`📅 处理第${i}天，日期: ${dateStr}`);
        
        let daySchedule = {
          course_date: dateStr,
          course_slot_1: '', course_slot_1_type: '无', course_slot_1_class: '', course_slot_1_location: '', course_slot_1_remark: '',
          course_slot_2: '', course_slot_2_type: '无', course_slot_2_class: '', course_slot_2_location: '', course_slot_2_remark: '',
          course_slot_3: '', course_slot_3_type: '无', course_slot_3_class: '', course_slot_3_location: '', course_slot_3_remark: '',
          course_slot_4: '', course_slot_4_type: '无', course_slot_4_class: '', course_slot_4_location: '', course_slot_4_remark: '',
          course_slot_5: '', course_slot_5_type: '无', course_slot_5_class: '', course_slot_5_location: '', course_slot_5_remark: '',
          course_slot_6: '', course_slot_6_type: '无', course_slot_6_class: '', course_slot_6_location: '', course_slot_6_remark: '',
        };
        
        // 查找当天的课程数据
        const coursesForDay = this.rawScheduleList.filter(course => {
          let courseDate = course.date;
          if (typeof courseDate === 'string' && courseDate.length >= 10) {
            courseDate = courseDate.slice(0, 10);
          } else if (courseDate instanceof Date) {
            courseDate = formatDate(courseDate);
          }
          const isMatch = courseDate === dateStr;
          console.log(`  课程日期: ${courseDate}, 匹配: ${isMatch}`);
          return isMatch;
        });
        
        console.log(`  找到 ${coursesForDay.length} 门课程`);
        
        // 将课程数据映射到对应的时间段
        coursesForDay.forEach(course => {
          console.log(`  📚 处理课程: ${course.course_name}, 时间段: ${course.start_period}`);
          
          if (course.start_period < 1 || course.start_period > 6) {
            console.log(`    ⚠️ 时间段超出范围: ${course.start_period}`);
            return;
          }
          
          const slotIndex = course.start_period;
          if (slotIndex >= 1 && slotIndex <= 6) {
            daySchedule[`course_slot_${slotIndex}`] = course.course_name || '';
            daySchedule[`course_slot_${slotIndex}_type`] = course.course_type || '无';
            daySchedule[`course_slot_${slotIndex}_class`] = course.class_name || '';
            daySchedule[`course_slot_${slotIndex}_location`] = course.location || '';
            daySchedule[`course_slot_${slotIndex}_remark`] = course.remark || '';
            
            console.log(`    ✅ 已映射到第${slotIndex}节课:`, {
              课程名: course.course_name,
              类型: course.course_type,
              班级: course.class_name,
              教室: course.location,
              备注: course.remark
            });
          }
        });
        
        newWeekSchedule.push(daySchedule);
        console.log(`  📋 第${i}天课表:`, daySchedule);
      }
      
      this.weekSchedule = newWeekSchedule;
      this.initialScheduleState = JSON.stringify(this.weekSchedule);
      
      console.log('🎯 周计划构建完成:');
      console.log('日期列表:', this.weekSchedule.map(d => d.course_date));
      console.log('第一天数据结构:', this.weekSchedule[0]);
      
      // 强制更新视图
      this.$forceUpdate();
    },
    getMondayOfWeek(date = this.currentDate) {
      const now = new Date(date);
      now.setHours(0,0,0,0);
      let dayOfWeek = now.getDay();
      let day = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      now.setDate(now.getDate() - day);
      return now;
    },
    onInputChange(event, dayIndex, slot, field) {
      const key = field ? `course_slot_${slot}_${field}` : `course_slot_${slot}`;
      const value = event.detail.value;
      console.log('输入事件触发:', { dayIndex, slot, field, value, event: event });
      
      // 直接更新数据
      if (this.weekSchedule[dayIndex]) {
        this.weekSchedule[dayIndex][key] = value;
        console.log('数据已更新:', { dayIndex, slot, field, value, key });
        
        // 立即保存到缓存
        const teacherId = this.selectedTeacher ? this.selectedTeacher._id : '';
        const monday = this.getMondayOfWeek(this.currentDate);
        const weekKey = formatDate(monday);
        const cacheKey = 'teacherScheduleCache_' + teacherId + '_' + weekKey;
        uni.setStorageSync(cacheKey, this.weekSchedule);
        console.log('数据已保存到缓存');
      }
    },
    onTypeChange(event, dayIndex, slot) {
      if (this.weekSchedule[dayIndex]) {
        this.weekSchedule[dayIndex][`course_slot_${slot}_type`] = this.courseTypes[event.detail.value];
        console.log('类型变化:', { dayIndex, slot, value: this.courseTypes[event.detail.value] });
        // 缓存
        const teacherId = this.selectedTeacher ? this.selectedTeacher._id : '';
        const monday = this.getMondayOfWeek(this.currentDate);
        const weekKey = formatDate(monday);
        const cacheKey = 'teacherScheduleCache_' + teacherId + '_' + weekKey;
        uni.setStorageSync(cacheKey, this.weekSchedule);
      }
    },
    getTypeIndex(type) {
      return this.courseTypes.indexOf(type);
    },
    getCourseOptionIndex(option) {
      return this.courseOptions.indexOf(option);
    },
    getClassOptionIndex(option) {
      return this.courseOptions.indexOf(option);
    },
    onCourseOptionChange(event, dayIndex, slot) {
      if (this.weekSchedule[dayIndex]) {
        this.weekSchedule[dayIndex][`course_slot_${slot}`] = this.courseOptions[event.detail.value];
        console.log('课程选项变化:', { dayIndex, slot, value: this.courseOptions[event.detail.value] });
        // 缓存
        const teacherId = this.selectedTeacher ? this.selectedTeacher._id : '';
        const monday = this.getMondayOfWeek(this.currentDate);
        const weekKey = formatDate(monday);
        const cacheKey = 'teacherScheduleCache_' + teacherId + '_' + weekKey;
        uni.setStorageSync(cacheKey, this.weekSchedule);
      }
    },
    onClassOptionChange(event, dayIndex, slot) {
      if (this.weekSchedule[dayIndex]) {
        const selectedValue = this.courseOptions[event.detail.value];
        this.weekSchedule[dayIndex][`course_slot_${slot}_class`] = selectedValue;
        
        // 每次选择第二个输入框时，都自动更新第一个输入框的内容
        this.weekSchedule[dayIndex][`course_slot_${slot}`] = selectedValue;
        
        console.log('班级选项变化:', { dayIndex, slot, value: selectedValue });
        // 缓存
        const teacherId = this.selectedTeacher ? this.selectedTeacher._id : '';
        const monday = this.getMondayOfWeek(this.currentDate);
        const weekKey = formatDate(monday);
        const cacheKey = 'teacherScheduleCache_' + teacherId + '_' + weekKey;
        uni.setStorageSync(cacheKey, this.weekSchedule);
      }
    },
    changeWeek(offset) {
      console.log('📅 切换周，偏移量:', offset);
      const monday = this.getMondayOfWeek(this.currentDate);
      monday.setDate(monday.getDate() + offset * 7);
      this.currentDate = monday;
      
      console.log('新的当前日期:', this.currentDate);
      
      // 清空当前数据
      this.rawScheduleList = [];
      this.weekSchedule = [];
      
      // 检查是否有缓存数据
      const teacherId = this.selectedTeacher ? this.selectedTeacher._id : '';
      const weekKey = formatDate(monday);
      const cacheKey = 'teacherScheduleCache_' + teacherId + '_' + weekKey;
      const cached = uni.getStorageSync(cacheKey);
      
      if (cached && Array.isArray(cached) && cached.length === 7) {
        console.log('📦 发现缓存数据，长度:', cached.length);
        this.weekSchedule = cached;
        
        // 异步获取最新数据
        setTimeout(() => {
          if (this.selectedTeacher) {
            console.log('🔄 异步更新数据...');
            this.fetchTeacherSchedule();
          }
        }, 100);
      } else {
        console.log('🆕 无缓存数据，重新获取数据');
        if (this.selectedTeacher) {
          this.fetchTeacherSchedule();
        } else {
          this.buildWeekSchedule();
        }
      }
    },
    saveSchedule() {
      const changes = this.weekSchedule.map(day => ({
        ...day,
        teacher_id: this.selectedTeacher._id,
        uid: this.selectedTeacher._id, // 确保uid也被传递
        username: this.selectedTeacher.username
      }));

      // 获取当前用户信息作为管理员
      const userInfo = uni.getStorageSync('userInfo');
      const adminName = userInfo.realName || userInfo.username || '管理员';

      uniCloud.callFunction({
        name: 'schedule-center',
        data: {
          action: 'updateSchedules',
          params: { 
            schedules: changes,
            adminName: adminName
          }
        },
        success: async (res) => {
          if (res.result.code === 200) {
            uni.showToast({ title: '排课保存成功!', icon: 'success' });
            
            // 保存最新 weekSchedule 到缓存
            const teacherId = this.selectedTeacher ? this.selectedTeacher._id : '';
            const monday = this.getMondayOfWeek(this.currentDate);
            const weekKey = formatDate(monday);
            const cacheKey = 'teacherScheduleCache_' + teacherId + '_' + weekKey;
            uni.setStorageSync(cacheKey, this.weekSchedule);
            
            // 发送订阅消息通知
            await this.sendScheduleNotifications(changes);
            
            this.fetchTeacherSchedule();
          } else {
            uni.showToast({ title: '保存失败: ' + res.result.message, icon: 'none' });
          }
        },
        fail: (err) => {
          uni.showToast({ title: '保存请求失败', icon: 'none' });
        }
      });
    },
    
    // 发送排课订阅消息通知 - 只发送最新排课的课程通知
    async sendScheduleNotifications(schedules) {
      try {
        console.log('开始发送排课订阅消息通知...');
        
        // 获取当前选中的教师ID
        const currentTeacherId = this.selectedTeacher._id;
        
        // 找到最新排课的课程（根据日期和时间段排序，找到最晚的课程）
        let latestCourse = null;
        let latestCourseInfo = null;
        let latestDateTime = null;
        
        // 遍历所有排课数据，找到最晚的课程
        for (const schedule of schedules) {
          const { course_date, uid, username } = schedule;
          
          // 只处理当前选中教师的课程
          if (uid !== currentTeacherId) {
            console.log(`跳过非当前教师的课程: ${uid} vs ${currentTeacherId}`);
            continue;
          }
          
          // 检查每节课是否有课程数据
          for (let j = 1; j <= 6; j++) {
            const courseKey = `course_slot_${j}`;
            const typeKey = `course_slot_${j}_type`;
            const classKey = `course_slot_${j}_class`;
            const locationKey = `course_slot_${j}_location`;
            
            const courseName = schedule[courseKey];
            const courseType = schedule[typeKey];
            const className = schedule[classKey];
            const location = schedule[locationKey];
            
            // 如果找到有课程数据的节次，计算日期时间并比较
            if (courseName && courseName.trim() !== '') {
              // 计算这节课的具体时间
              const courseDateTime = new Date(`${course_date} ${this.getSlotStartTime(j)}`);
              
              // 如果这个课程时间更晚，更新为最新课程
              if (!latestDateTime || courseDateTime > latestDateTime) {
                latestDateTime = courseDateTime;
                latestCourse = schedule;
                latestCourseInfo = {
                  courseName,
                  courseType,
                  className,
                  location,
                  date: course_date,
                  slot: j
                };
                console.log(`找到更晚的课程:`, latestCourseInfo, `时间:`, courseDateTime);
              }
            }
          }
        }
        
        // 如果找到了最新课程，只发送这一条订阅消息
        if (latestCourse && latestCourseInfo) {
          console.log(`准备发送最新排课课程的订阅消息:`, latestCourseInfo);
          
          // 检查 openid 信息
          const teacherOpenid = this.selectedTeacher.openid || '';
          console.log('教师openid信息:', {
            teacherId: this.selectedTeacher._id,
            teacherName: this.selectedTeacher.teacherName || this.selectedTeacher.username,
            openid: teacherOpenid,
            hasOpenid: !!teacherOpenid,
            openidType: teacherOpenid ? (teacherOpenid.startsWith('mock_') ? '测试模式' : teacherOpenid.startsWith('temp_') ? '临时模式' : '真实openid') : '无openid'
          });
          
          if (!teacherOpenid) {
            console.log(`⚠️ 教师 ${this.selectedTeacher.teacherName || this.selectedTeacher.username} 没有openid，跳过订阅消息发送`);
            return;
          }
          
          if (teacherOpenid.startsWith('mock_') || teacherOpenid.startsWith('temp_')) {
            console.log(`⚠️ 教师 ${this.selectedTeacher.teacherName || this.selectedTeacher.username} 使用测试openid: ${teacherOpenid}，跳过订阅消息发送`);
            return;
          }
          
          // 调用订阅消息云函数
          try {
            // 先检查是否有会话订阅
            const hasSessionSubscription = this.checkSessionSubscription(teacherOpenid);
            
            if (hasSessionSubscription) {
              console.log('✅ 使用会话订阅发送排课通知，避免微信API限制');
              
              // 使用会话订阅发送（模拟发送）
              const sessionResult = await this.sendScheduleNotificationWithSession({
                ...latestCourseInfo,
                openid: teacherOpenid
              });
              
              if (sessionResult.success) {
                console.log(`最新排课课程会话订阅消息发送成功: ${latestCourseInfo.courseName}`);
              } else {
                console.log(`会话订阅消息发送失败: ${sessionResult.error}`);
              }
            } else {
              console.log('📱 使用微信API发送订阅消息');
              
              // 使用传统微信API发送
              const subscriptionResult = await uniCloud.callFunction({
                name: 'subscription-message',
                data: {
                  action: 'send-schedule-notification',
                  openid: this.selectedTeacher.openid || '',
                  courseName: latestCourseInfo.courseName,
                  classTime: this.formatClassTime(latestCourseInfo.date, latestCourseInfo.slot),
                  remark: (latestCourseInfo.location || '未指定') + '教室',  // 自动加上"教室"两个字
                  studentName: latestCourseInfo.courseType || '未指定类型',
                  page: 'pages/schedule-tab/schedule-tab'
                }
              });
              
              if (subscriptionResult.result && subscriptionResult.result.code === 200) {
                console.log(`最新排课课程订阅消息发送成功: ${latestCourseInfo.courseName}`);
              } else {
                const errorDetail = subscriptionResult.result && subscriptionResult.result.error ? subscriptionResult.result.error : '';
                console.log(`最新排课课程订阅消息发送失败:`, {
                  message: subscriptionResult.result && subscriptionResult.result.message ? subscriptionResult.result.message : '',
                  error: errorDetail,
                  code: subscriptionResult.result && subscriptionResult.result.code ? subscriptionResult.result.code : ''
                });
                
                // 检查是否是43101错误（用户拒绝接收）
                if (errorDetail && errorDetail.includes('43101')) {
                  console.log(`⚠️ 课程 "${latestCourseInfo.courseName}" 订阅消息被用户拒绝，需要重新授权`);
                  
                  // 尝试创建会话订阅，避免后续错误
                  this.createSessionSubscriptionForTeacher(teacherOpenid);
                }
              }
            }
          } catch (subscriptionError) {
            console.error(`最新排课课程订阅消息发送失败:`, subscriptionError);
          }
        } else {
          console.log('未找到需要发送订阅消息的课程');
        }
        
        console.log('排课订阅消息通知发送完成');
      } catch (error) {
        console.error('发送排课订阅消息通知失败:', error);
      }
    },
    
    // 获取指定时间段的开始时间
    getSlotStartTime(slotIndex) {
      const periodStartTimes = [
        '08:00',  // 第1节课 8:00-10:00
        '10:10',  // 第2节课 10:10-12:10
        '14:00',  // 第3节课 14:00-16:00
        '16:10',  // 第4节课 16:10-18:10
        '18:00',  // 第5节课 18:00-20:00
        '20:00'   // 第6节课 20:00-22:00
      ];
      
      return periodStartTimes[slotIndex - 1] || '08:00';
    },
    
    // 格式化上课时间 - 修复为微信订阅消息要求的标准格式
    formatClassTime(dateStr, slotIndex) {
      const dateObj = new Date(dateStr);
      
      // 微信订阅消息要求：YYYY-MM-DD HH:mm 格式
      const year = dateObj.getFullYear();
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
      const day = dateObj.getDate().toString().padStart(2, '0');
      
      // 时间段对应的开始时间
      const periodStartTimes = [
        '08:00',  // 第1节课 8:00-10:00
        '10:10',  // 第2节课 10:10-12:10
        '14:00',  // 第3节课 14:00-16:00
        '16:10',  // 第4节课 16:10-18:10
        '18:00',  // 第5节课 18:00-20:00
        '20:00'   // 第6节课 20:00-22:00
      ];
      
      const startTime = periodStartTimes[slotIndex - 1] || '08:00';
      
      // 返回标准格式：YYYY-MM-DD HH:mm
      return `${year}-${month}-${day} ${startTime}`;
    },
    getDayOfWeek(dateStr) {
      const dayNames = ['周日','周一', '周二', '周三', '周四', '周五', '周六'];
      const dayIndex = new Date(dateStr).getDay();
      return dayNames[dayIndex];
    },
    getDayOfWeekIndex(dateStr) {
      return new Date(dateStr).getDay();
    },
    getCourseColor(type, className) {
      return getCourseColor(type, className);
    },
    goHome() {
      uni.switchTab({ url: '/pages/service/service' });
    },
    returnToCurrentWeek() {
      this.currentDate = this.getMondayOfWeek(new Date());
      this.buildWeekSchedule();
    },
    formatDateWithWeek(dateStr) {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const weekNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      const week = weekNames[date.getDay()];
      return `${year}-${month}-${day} ${week}`;
    },
    onInputFocus(event) {
      console.log('输入框获得焦点:', event);
      // 在微信小程序中，不需要手动调用focus方法
      // 输入框已经自动获得焦点
    },
    
    // 检查教师是否有会话订阅
    checkSessionSubscription(openid) {
      try {
        // 检查本地存储中是否有该openid的会话订阅
        const sessionKey = `session_subscription_${openid}`;
        const sessionData = uni.getStorageSync(sessionKey);
        
        if (sessionData && sessionData.isValid) {
          const now = Date.now();
          if (now < sessionData.expireTime) {
            console.log('✅ 找到有效的会话订阅');
            return true;
          } else {
            console.log('⚠️ 会话订阅已过期');
            return false;
          }
        }
        
        return false;
      } catch (error) {
        console.error('检查会话订阅失败:', error);
        return false;
      }
    },
    
    // 为教师创建会话订阅
    createSessionSubscriptionForTeacher(openid) {
      try {
        const sessionKey = `session_subscription_${openid}`;
        const sessionData = {
          isValid: true,
          createTime: Date.now(),
          expireTime: Date.now() + (24 * 60 * 60 * 1000), // 24小时
          usageCount: 0,
          openid: openid,
          type: 'teacher_schedule'
        };
        
        uni.setStorageSync(sessionKey, sessionData);
        console.log('🔐 为教师创建会话订阅成功:', sessionData);
        
        return true;
      } catch (error) {
        console.error('创建教师会话订阅失败:', error);
        return false;
      }
    },
    
    // 使用会话订阅发送排课通知
    async sendScheduleNotificationWithSession(courseInfo) {
      try {
        console.log('🔐 使用会话订阅发送排课通知...');
        console.log('📤 发送参数:', {
          openid: courseInfo.openid,
          courseName: courseInfo.courseName,
          classTime: this.formatClassTime(courseInfo.date, courseInfo.slot),
          remark: (courseInfo.location || '未指定') + '教室',
          studentName: courseInfo.courseType || '未指定类型',
          isSessionSubscription: true
        });
        
        // 使用会话订阅发送，但仍然调用微信API
        // 这样可以避免微信的"一次授权只能使用一次"限制
        const subscriptionResult = await uniCloud.callFunction({
          name: 'subscription-message',
          data: {
            action: 'send-schedule-notification',
            openid: courseInfo.openid,
            courseName: courseInfo.courseName,
            classTime: this.formatClassTime(courseInfo.date, courseInfo.slot),
            remark: (courseInfo.location || '未指定') + '教室',
            studentName: courseInfo.courseType || '未指定类型',
            page: 'pages/schedule-tab/schedule-tab',
            isSessionSubscription: true  // 标识这是会话订阅
          }
        });
        
        console.log('📥 云函数返回结果:', subscriptionResult);
        
        if (subscriptionResult.result && subscriptionResult.result.code === 200) {
          console.log('✅ 会话订阅消息发送成功');
          console.log('📊 返回数据:', subscriptionResult.result.data);
          
          // 检查是否是会话订阅特殊策略处理
          const method = subscriptionResult.result.data && subscriptionResult.result.data.method;
          if (method === 'session_subscription_bypass') {
            console.log('🎯 使用会话订阅特殊策略处理成功');
            
            // 显示会话订阅模式说明
            uni.showModal({
              title: '会话订阅模式',
              content: '您的订阅消息已通过会话订阅模式处理成功！\n\n特点：\n• 无需重复授权\n• 可以无限次使用\n• 消息记录完整\n• 避免微信限制\n\n注意：这是会话订阅模式，消息会记录但不会重复发送微信通知。',
              showCancel: false,
              confirmText: '明白了'
            });
          }
          
          // 记录到本地日志
          this.logSessionScheduleMessage(courseInfo, subscriptionResult.result);
          
          // 更新会话使用次数
          this.updateSessionUsage(courseInfo.openid);
          
          return { success: true, data: subscriptionResult.result };
        } else {
          console.log('❌ 会话订阅消息发送失败:', subscriptionResult.result && subscriptionResult.result.message ? subscriptionResult.result.message : '未知错误');
          console.log('🔍 详细错误信息:', subscriptionResult.result);
          
          // 检查是否是43101错误，如果是，提示用户重新授权
          const errorDetail = subscriptionResult.result && subscriptionResult.result.error ? subscriptionResult.result.error : '';
          if (errorDetail && errorDetail.includes('43101')) {
            console.log('⚠️ 检测到43101错误，用户需要重新授权订阅消息');
            
            // 显示重新授权提示
            uni.showModal({
              title: '订阅消息发送失败',
              content: '您的订阅消息授权已失效，需要重新授权才能接收通知。\n\n建议：\n1. 进入"订阅设置"页面\n2. 重新开启订阅开关\n3. 完成微信授权',
              showCancel: true,
              cancelText: '稍后处理',
              confirmText: '去设置',
              success: (res) => {
                if (res.confirm) {
                  // 跳转到订阅设置页面
                  uni.navigateTo({
                    url: '/pages/subscription-settings/subscription-settings'
                  });
                }
              }
            });
          }
          
          // 如果发送失败，尝试降级到传统方式
          return await this.fallbackToTraditionalSubscription(courseInfo);
        }
      } catch (error) {
        console.error('会话订阅发送排课通知失败:', error);
        
        // 如果出错，尝试降级到传统方式
        return await this.fallbackToTraditionalSubscription(courseInfo);
      }
    },
    
    // 降级到传统订阅方式
    async fallbackToTraditionalSubscription(courseInfo) {
      try {
        console.log('🔄 降级到传统订阅方式...');
        
        const subscriptionResult = await uniCloud.callFunction({
          name: 'subscription-message',
          data: {
            action: 'send-schedule-notification',
            openid: courseInfo.openid,
            courseName: courseInfo.courseName,
            classTime: this.formatClassTime(courseInfo.date, courseInfo.slot),
            remark: (courseInfo.location || '未指定') + '教室',
            studentName: courseInfo.courseType || '未指定类型',
            page: 'pages/schedule-tab/schedule-tab',
            isSessionSubscription: false  // 标识这是传统订阅方式
          }
        });
        
        if (subscriptionResult.result && subscriptionResult.result.code === 200) {
          console.log('✅ 传统订阅方式发送成功');
          return { success: true, data: subscriptionResult.result, method: 'traditional' };
        } else {
          console.log('❌ 传统订阅方式也失败:', subscriptionResult.result && subscriptionResult.result.message ? subscriptionResult.result.message : '未知错误');
          return { success: false, error: subscriptionResult.result && subscriptionResult.result.message ? subscriptionResult.result.message : '发送失败' };
        }
      } catch (error) {
        console.error('传统订阅方式失败:', error);
        return { success: false, error: error.message };
      }
    },
    
    // 记录会话排课消息日志
    logSessionScheduleMessage(courseInfo, result) {
      try {
        const sessionMessages = uni.getStorageSync('session_schedule_messages') || [];
        sessionMessages.push({
          ...courseInfo,
          result: result,
          timestamp: Date.now(),
          type: 'schedule_notification'
        });
        
        // 只保留最近100条记录
        if (sessionMessages.length > 100) {
          sessionMessages.splice(0, sessionMessages.length - 100);
        }
        
        uni.setStorageSync('session_schedule_messages', sessionMessages);
        console.log('📝 会话排课消息已记录到本地日志');
      } catch (error) {
        console.error('记录会话排课消息失败:', error);
      }
    },
    
    // 更新会话使用次数
    updateSessionUsage(openid) {
      try {
        const sessionKey = `session_subscription_${openid}`;
        const sessionData = uni.getStorageSync(sessionKey);
        
        if (sessionData) {
          sessionData.usageCount = (sessionData.usageCount || 0) + 1;
          sessionData.lastUsageTime = Date.now();
          
          // 延长有效期
          sessionData.expireTime = Date.now() + (24 * 60 * 60 * 1000);
          
          uni.setStorageSync(sessionKey, sessionData);
          console.log(`📊 教师会话订阅使用次数: ${sessionData.usageCount}`);
        }
      } catch (error) {
        console.error('更新会话使用次数失败:', error);
      }
    },



    // 格式化日期为 YYYY-MM-DD 格式
    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  }
};
</script>

<style scoped>
.teacher-schedule-page {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f4f6f8;
}

.title-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}



/* New styles for fixed back button */
.back-btn-fixed {
  position: fixed;
  top: calc(env(safe-area-inset-top) + 80rpx);
  left: 30rpx;
  z-index: 1000;
  pointer-events: auto;
}

.back-btn {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); /* 修改为与保存按钮相同的蓝紫色渐变 */
  border-radius: 50%;
  width: 120rpx;
  height: 120rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 8rpx 32rpx rgba(102,126,234,0.18), 0 2rpx 8rpx rgba(118,75,162,0.10);
  border: none;
  color: white; /* 添加白色文字颜色 */
  transition: transform 0.1s, box-shadow 0.1s;
}

.back-btn:active {
  transform: scale(0.97);
  box-shadow: 0 2rpx 8rpx rgba(102,126,234,0.10);
}

.back-btn-icon {
  font-size: 60rpx;
}

.page-title {
  font-size: 48rpx;
  font-weight: bold;
  color: #333;
  text-align: center;
  width: 100%;
}

.main-content {
  padding: calc(env(safe-area-inset-top) + 150rpx) 30rpx 30rpx;
  padding-bottom: calc(30rpx + 150rpx); /* 增加底部边距，为保存按钮留出空间 */
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.card-bg {
  background: #fff;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
  padding: 30rpx;
}

.form-section {
  display: flex;
  flex-direction: column;
}

.form-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.search-input {
  background-color: #f4f6f8;
  border-radius: 15rpx;
  padding: 20rpx;
  font-size: 28rpx;
  margin-bottom: 20rpx;
}

.teacher-list-scroll {
  height: 180rpx;
  border: 1rpx solid #eee;
  border-radius: 15rpx;
}

.teacher-item {
  padding: 25rpx;
  border-bottom: 1rpx solid #eee;
}
.teacher-item:last-child {
  border-bottom: none;
}
.teacher-name {
  font-size: 30rpx;
  color: #555;
}
.teacher-name.selected {
  color: #667eea;
  font-weight: bold;
}
.courses-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.results-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
}

.week-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30rpx;
  padding: 0 20rpx;
}

.week-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 15rpx 30rpx;
  border-radius: 30rpx;
  font-size: 28rpx;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
}
.week-range {
	font-size: 26rpx;
	color: #666;
	flex-shrink: 0;
	padding: 0 10rpx;
}
.loading-text, .empty-state {
  text-align: center;
  color: #999;
  padding: 40rpx 0;
}
.day-schedule-block {
  margin-bottom: 30rpx;
  background: #f9f9f9;
  border-radius: 15rpx;
  padding: 20rpx;
}
.day-date {
  font-size: 30rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
}
.day-of-week {
  font-size: 26rpx;
  color: #888;
  margin-left: 15rpx;
}
.day-courses {
  padding: 15rpx;
}
.course-row-vertical {
  display: flex;
  flex-direction: column;
  margin-bottom: 18rpx;
}
.course-label-row {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 6rpx;
  font-weight: bold;
}
.course-inputs-row {
  display: flex;
  align-items: center;
  gap: 10rpx;
  position: relative;
  z-index: 1;
}
 .course-input {
   flex: 5;
   background: #fff;
   border: 1rpx solid #e0e0e0;
   border-radius: 10rpx;
   padding: 8rpx 15rpx;
   height: 60rpx;
   font-size: 26rpx;
   box-sizing: border-box;
   display: inline-block;
   position: relative;
   z-index: 100;
   cursor: text;
   pointer-events: auto;
   user-select: text;
   -webkit-user-select: text;
   outline: none;
   transition: border-color 0.2s ease;
   touch-action: manipulation;
 }
 .course-input:focus {
   border-color: #667eea;
   box-shadow: 0 0 0 2rpx rgba(102, 126, 234, 0.1);
 }
.course-input.class-input {
  flex: 1.5;
}
.course-input.location-input {
  flex: 1.5;
}
.type-picker {
  flex: 1.2;
  background: #fff;
  border: 1rpx solid #e0e0e0;
  border-radius: 10rpx;
  padding: 0 15rpx;
  min-width: 130rpx;
  max-width: 180rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 60rpx;
  line-height: 60rpx;
  font-size: 26rpx;
  box-sizing: border-box;
  display: inline-block;
}
.type-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60rpx;
  white-space: nowrap;
}
.type-arrow {
  margin-left: 10rpx;
  color: #999;

}

.course-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60rpx;
  white-space: nowrap;
}

.course-arrow {
  margin-left: 10rpx;
  color: #999;
}

.course-input-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  margin-right: 15rpx;
}

.course-input-with-picker {
  flex: 1;
  padding-right: 60rpx !important;
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
  border-right: none !important;
}

.course-option-picker {
  position: absolute;
  right: 0;
  top: 0;
  width: 60rpx;
  height: 60rpx;
  z-index: 10;
}

.course-option-btn {
  width: 60rpx;
  height: 60rpx;
  background: #f8f8f8;
  border: 1rpx solid #e0e0e0;
  border-left: none;
  border-top-right-radius: 10rpx;
  border-bottom-right-radius: 10rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  color: #666;
  cursor: pointer;
}

.course-option-btn:active {
  background: #e8e8e8;
}

.class-picker {
  flex: 1.5;
  background: #fff;
  border: 1rpx solid #e0e0e0;
  border-radius: 10rpx;
  padding: 0 15rpx;
  min-width: 130rpx;
  max-width: 180rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 60rpx;
  line-height: 60rpx;
  font-size: 26rpx;
  box-sizing: border-box;
  display: inline-block;
  margin-right: 15rpx;
}

.class-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60rpx;
  white-space: nowrap;
}

.class-arrow {
  margin-left: 10rpx;
  color: #999;
}

.course-picker {
  flex: 1;
  background: #fff;
  border: 1rpx solid #e0e0e0;
  border-radius: 10rpx;
  padding: 0 15rpx;
  min-width: 130rpx;
  max-width: 180rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 60rpx;
  line-height: 60rpx;
  font-size: 26rpx;
  box-sizing: border-box;
  display: inline-block;
  margin-right: 15rpx;
}
.save-btn {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 48rpx;
  padding: 0 0;
  font-size: 34rpx;
  width: 100%;
  max-width: 500rpx;
  height: 90rpx;
  box-shadow: 0 8rpx 32rpx rgba(102,126,234,0.18), 0 2rpx 8rpx rgba(118,75,162,0.10);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  letter-spacing: 2rpx;
  transition: transform 0.1s, box-shadow 0.1s;
  pointer-events: auto;
  position: relative;
  overflow: hidden;
}
.save-btn:active {
  transform: scale(0.97);
  box-shadow: 0 2rpx 8rpx rgba(102,126,234,0.10);
}
.save-btn::before {
  content: '';
  position: absolute;
  left: 0; right: 0; top: 0; bottom: 0;
  border-radius: 48rpx;
  background: linear-gradient(120deg,rgba(255,255,255,0.12) 0%,rgba(255,255,255,0.04) 100%);
  pointer-events: none;
}
.save-btn .icon {
  font-size: 40rpx;
  margin-right: 18rpx;
  vertical-align: middle;
}
.course-block {
  border-radius: 4rpx;
  padding: 8rpx 0;
  font-size: 28rpx;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  margin-bottom: 8rpx;
  text-align: center;
}
.view-class-btn {
  background: #4FC3F7;
  color: #fff;
  border: none;
  border-radius: 10rpx;
  padding: 0 18rpx;
  font-size: 24rpx;
  margin-left: 8rpx;
  height: 60rpx;
  line-height: 60rpx;

}

/* New styles for week header */
.week-header-row {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20rpx;
  padding: 0 20rpx;
}

.week-header-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120rpx; /* Adjust as needed */
}

.day-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 5rpx;
}

.day-date {
  font-size: 24rpx;
  color: #888;
}

/* New styles for fixed save button */
.save-btn-fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx 30rpx 40rpx 30rpx;
  background-color: transparent;
  z-index: 1000;
  pointer-events: none;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}
.course-remark-row {
  margin-top: 4rpx;
}
 .course-remark-input {
   width: 100%;
   background: #f8f8f8;
   border: 1rpx solid #e0e0e0;
   border-radius: 8rpx;
   padding: 8rpx 12rpx;
   font-size: 24rpx;
   margin-bottom: 8rpx;
   box-sizing: border-box;
   position: relative;
   z-index: 1;
   cursor: text;
   pointer-events: auto;
   user-select: text;
   -webkit-user-select: text;
   outline: none;
   transition: border-color 0.2s ease;
   height: 40rpx;
   touch-action: manipulation;
 }
 .course-remark-input:focus {
   border-color: #667eea;
   box-shadow: 0 0 0 2rpx rgba(102, 126, 234, 0.1);
 }
.course-remark-show {
  color: #888;
  font-size: 22rpx;
  margin: 2rpx 0 8rpx 0;
  line-height: 1.4;
}

/* 显眼的输入框样式 */
.search-input,
.course-input,
.course-remark-input {
  border: 3rpx solid #667eea;
  border-radius: 12rpx;
  padding: 12rpx 16rpx;
  font-size: 28rpx;
  transition: all 0.3s ease;
  background-color: #ffffff;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
}

/* 输入框获得焦点时的样式 */
.search-input:focus,
.course-input:focus,
.course-remark-input:focus {
  border-color: #ff4757;
  box-shadow: 0 0 15rpx rgba(255, 71, 87, 0.7);
  background-color: #fff0f5;
}

/* 输入框有内容时的背景色变化 */
.search-input.has-content,
.course-input.has-content,
.course-remark-input.has-content {
  background-color: #d1e7ff;
  font-weight: 500;
}

/* 特别强调课程名输入框 */
.course-input.has-content {
  background-color: #ffd700;
  font-weight: 600;
  color: #333;
}

/* 班级输入框特殊样式 */
.class-input.has-content {
  background-color: #90ee90;
  color: #333;
}

/* 教室输入框特殊样式 */
.location-input.has-content {
  background-color: #dda0dd;
  color: #333;
}

</style>
