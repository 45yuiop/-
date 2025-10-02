'use strict';

const db = uniCloud.database()
const examAnalysisCollection = db.collection('exam_analysis')

exports.main = async (event, context) => {
	const { action, data } = event
	
	switch (action) {
		case 'save':
			return await saveExamAnalysis(data)
		case 'update':
			return await updateExamAnalysis(data)
		case 'getList':
			return await getExamAnalysisList(data)
		case 'getDetail':
			return await getExamAnalysisDetail(data)
		case 'delete':
			return await deleteExamAnalysis(data)
		case 'uploadImages':
			return await uploadImages(data)
		default:
			return {
				code: -1,
				message: '未知操作'
			}
	}
}

// 保存试卷分析
async function saveExamAnalysis(data) {
	try {
		const { 
			year, 
			month, 
			examType, 
			examImages, 
			analysisText, 
			analysisImages, 
			difficultyRating, 
			studentPerformance,
			studentId,
			studentName,
			grade,
			userId,
			userName
		} = data
		
		// 验证必填字段
		if (!year || !month || !examType) {
			return {
				code: -1,
				message: '请填写完整的基本信息'
			}
		}
		
		if (!studentId || !studentName || !grade) {
			return {
				code: -1,
				message: '请选择年级和学生'
			}
		}
		
		if (!examImages || examImages.length === 0) {
			return {
				code: -1,
				message: '请上传试卷图片'
			}
		}
		
		if ((!analysisText || analysisText.trim() === '') && (!analysisImages || analysisImages.length === 0)) {
			return {
				code: -1,
				message: '请填写试卷分析或上传分析图片'
			}
		}
		
		if (!difficultyRating || difficultyRating === 0) {
			return {
				code: -1,
				message: '请选择考试难度'
			}
		}
		
		if (!studentPerformance || studentPerformance === 0) {
			return {
				code: -1,
				message: '请选择学生答题效果'
			}
		}
		
		// 构建保存数据
		const examAnalysisData = {
			year,
			month,
			examType,
			examImages,
			analysisText: analysisText || '',
			analysisImages: analysisImages || [],
			difficultyRating,
			studentPerformance,
			studentId,
			studentName,
			grade,
			userId,
			userName,
			createTime: new Date(),
			updateTime: new Date()
		}
		
		// 保存到数据库
		const result = await examAnalysisCollection.add(examAnalysisData)
		
		return {
			code: 0,
			message: '保存成功',
			data: result
		}
		
	} catch (error) {
		console.error('保存试卷分析失败:', error)
		return {
			code: -1,
			message: '保存失败，请重试'
		}
	}
}

// 更新试卷分析
async function updateExamAnalysis(data) {
	try {
		const { 
			id,
			year, 
			month, 
			examType, 
			examImages, 
			analysisText, 
			analysisImages, 
			difficultyRating, 
			studentPerformance,
			studentId,
			studentName,
			grade,
			userId,
			userRole
		} = data
		
		// 验证必填字段
		if (!id) {
			return {
				code: -1,
				message: '缺少记录ID'
			}
		}
		
		if (!year || !month || !examType) {
			return {
				code: -1,
				message: '请填写完整的基本信息'
			}
		}
		
		if (!studentId || !studentName || !grade) {
			return {
				code: -1,
				message: '请选择年级和学生'
			}
		}
		
		if (!examImages || examImages.length === 0) {
			return {
				code: -1,
				message: '请上传试卷图片'
			}
		}
		
		if ((!analysisText || analysisText.trim() === '') && (!analysisImages || analysisImages.length === 0)) {
			return {
				code: -1,
				message: '请填写试卷分析或上传分析图片'
			}
		}
		
		if (!difficultyRating || difficultyRating === 0) {
			return {
				code: -1,
				message: '请选择考试难度'
			}
		}
		
		if (!studentPerformance || studentPerformance === 0) {
			return {
				code: -1,
				message: '请选择学生答题效果'
			}
		}
		
		// 获取原有数据，以便删除旧的云存储图片
		const oldData = await examAnalysisCollection.doc(id).get()
		if (oldData.data && oldData.data.length > 0) {
			const oldItem = oldData.data[0]
			
			// 删除旧的试卷图片（如果新的图片与旧的不同）
			if (oldItem.examImages && Array.isArray(oldItem.examImages)) {
				for (const oldFileID of oldItem.examImages) {
					// 检查这个文件ID是否还在新的图片列表中
					if (!examImages.includes(oldFileID)) {
						try {
							await uniCloud.deleteFile({
								fileList: [oldFileID]
							})
							console.log('删除旧试卷图片成功:', oldFileID)
						} catch (deleteError) {
							console.error('删除旧试卷图片失败:', oldFileID, deleteError)
						}
					}
				}
			}
			
			// 删除旧的分析图片（如果新的图片与旧的不同）
			if (oldItem.analysisImages && Array.isArray(oldItem.analysisImages)) {
				for (const oldFileID of oldItem.analysisImages) {
					// 检查这个文件ID是否还在新的图片列表中
					if (!analysisImages.includes(oldFileID)) {
						try {
							await uniCloud.deleteFile({
								fileList: [oldFileID]
							})
							console.log('删除旧分析图片成功:', oldFileID)
						} catch (deleteError) {
							console.error('删除旧分析图片失败:', oldFileID, deleteError)
						}
					}
				}
			}
		}
		
		// 构建更新数据
		const updateData = {
			year,
			month,
			examType,
			examImages,
			analysisText: analysisText || '',
			analysisImages: analysisImages || [],
			difficultyRating,
			studentPerformance,
			studentId,
			studentName,
			grade,
			updateTime: new Date()
		}
		
		// 更新数据库
		await examAnalysisCollection.doc(id).update(updateData)
		
		return {
			code: 0,
			message: '更新成功'
		}
		
	} catch (error) {
		console.error('更新试卷分析失败:', error)
		return {
			code: -1,
			message: '更新失败，请重试'
		}
	}
}

// 获取试卷分析列表
async function getExamAnalysisList(data) {
	try {
		const { 
			userId, 
			page = 1, 
			pageSize = 10,
			year,
			month,
			examType,
			userRole
		} = data
		
		console.log('getExamAnalysisList - 输入参数:', { userId, page, pageSize, year, month, examType, userRole })
		
		// 根据用户角色过滤 - 如果不是管理员，只能查看自己的数据
		const isAdmin = userRole && (
			(Array.isArray(userRole) && userRole.some(role => role.includes('管理员') || role === '管理员')) ||
			(typeof userRole === 'string' && (userRole.includes('管理员') || userRole === '管理员'))
		)
		console.log('getExamAnalysisList - 用户角色判断:', { userRole, isAdmin })
		
		// 构建查询条件对象
		let filter = {};
		// 所有用户都能查看所有数据
		// if (!isAdmin) filter.userId = userId;
		if (year && year.trim() !== '') filter.year = year;
		if (month && month.trim() !== '') filter.month = month;
		if (examType && examType.trim() !== '') filter.examType = examType;
		console.log('getExamAnalysisList - 最终查询条件:', filter);
		let query = examAnalysisCollection.where(filter);

		// 按创建时间倒序排列
		query = query.orderBy('createTime', 'desc');

		// 分页查询
		const skip = (page - 1) * pageSize;
		console.log('getExamAnalysisList - 分页参数:', { skip, pageSize });

		const result = await query.skip(skip).limit(pageSize).get();
		console.log('getExamAnalysisList - 查询结果数量:', result.data ? result.data.length : 0);
		console.log('getExamAnalysisList - 查询结果:', result.data);

		// 调试：检查返回数据的格式
		if (result.data && result.data.length > 0) {
			console.log('getExamAnalysisList - 返回数据格式检查:', result.data.map(item => ({
				year: item.year,
				month: item.month,
				examType: item.examType
			})));
		}
		
		// 获取总数
		const countResult = await query.count()
		console.log('getExamAnalysisList - 总数:', countResult.total)
		
		// 如果没有数据，尝试查询所有数据（用于调试）
		if (!result.data || result.data.length === 0) {
			console.log('getExamAnalysisList - 没有找到数据，尝试查询所有数据')
			const allData = await examAnalysisCollection.limit(10).get()
			console.log('getExamAnalysisList - 所有数据:', allData.data)
			
			// 如果还是没有数据，返回空列表
			if (!allData.data || allData.data.length === 0) {
				console.log('getExamAnalysisList - 数据库中确实没有数据')
				return {
					code: 0,
					message: '获取成功',
					data: {
						list: [],
						total: 0,
						page,
						pageSize
					}
				}
			}
		}
		
		// 处理返回的数据，确保有默认值
		const processedList = result.data.map(item => ({
			...item,
			grade: item.grade || '未知年级',
			studentName: item.studentName || '未知学生',
			userName: item.userName || '未知用户'
		}))
		
		console.log('getExamAnalysisList - 处理后的数据:', processedList)
		
		return {
			code: 0,
			message: '获取成功',
			data: {
				list: processedList,
				total: countResult.total,
				page,
				pageSize
			}
		}
		
	} catch (error) {
		console.error('获取试卷分析列表失败:', error)
		return {
			code: -1,
			message: '获取失败，请重试'
		}
	}
}

// 获取试卷分析详情
async function getExamAnalysisDetail(data) {
	try {
		const { id } = data
		
		if (!id) {
			return {
				code: -1,
				message: '缺少必要参数'
			}
		}
		
		const result = await examAnalysisCollection.doc(id).get()
		
		if (result.data && result.data.length > 0) {
			return {
				code: 0,
				message: '获取成功',
				data: result.data[0]
			}
		} else {
			return {
				code: -1,
				message: '数据不存在'
			}
		}
		
	} catch (error) {
		console.error('获取试卷分析详情失败:', error)
		return {
			code: -1,
			message: '获取失败，请重试'
		}
	}
}

// 删除试卷分析
async function deleteExamAnalysis(data) {
	try {
		const { id, userId, userRole } = data
		
		if (!id) {
			return {
				code: -1,
				message: '缺少必要参数'
			}
		}
		
		// 先获取要删除的数据，以便删除云存储中的图片
		const examAnalysis = await examAnalysisCollection.doc(id).get()
		if (examAnalysis.data && examAnalysis.data.length > 0) {
			const item = examAnalysis.data[0]
			
			// 删除云存储中的试卷图片
			if (item.examImages && Array.isArray(item.examImages)) {
				for (const fileID of item.examImages) {
					try {
						await uniCloud.deleteFile({
							fileList: [fileID]
						})
						console.log('删除试卷图片成功:', fileID)
					} catch (deleteError) {
						console.error('删除试卷图片失败:', fileID, deleteError)
						// 继续删除其他文件，不因为单个文件删除失败而中断
					}
				}
			}
			
			// 删除云存储中的分析图片
			if (item.analysisImages && Array.isArray(item.analysisImages)) {
				for (const fileID of item.analysisImages) {
					try {
						await uniCloud.deleteFile({
							fileList: [fileID]
						})
						console.log('删除分析图片成功:', fileID)
					} catch (deleteError) {
						console.error('删除分析图片失败:', fileID, deleteError)
						// 继续删除其他文件，不因为单个文件删除失败而中断
					}
				}
			}
		}
		
		// 删除数据库记录
		await examAnalysisCollection.doc(id).remove()
		
		return {
			code: 0,
			message: '删除成功'
		}
		
	} catch (error) {
		console.error('删除试卷分析失败:', error)
		return {
			code: -1,
			message: '删除失败，请重试'
		}
	}
}

// 上传图片到云存储
async function uploadImages(data) {
	try {
		const { examImages, analysisImages } = data
		
		const examImageFileIDs = []
		const analysisImageFileIDs = []
		
		// 上传试卷图片
		if (examImages && Array.isArray(examImages)) {
			for (let i = 0; i < examImages.length; i++) {
				const imageData = examImages[i]
				const fileName = `exam_images/${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}.jpg`
				
				try {
					// 将base64数据写入临时文件
					const tempFilePath = `/tmp/temp_${Date.now()}_${i}.jpg`
					const fs = require('fs')
					
					// 移除data:image/jpeg;base64,前缀
					const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, '')
					const buffer = Buffer.from(base64Data, 'base64')
					
					fs.writeFileSync(tempFilePath, buffer)
					
					const uploadResult = await uniCloud.uploadFile({
						filePath: tempFilePath,
						cloudPath: fileName
					})
					
					// 删除临时文件
					fs.unlinkSync(tempFilePath)
					
					examImageFileIDs.push(uploadResult.fileID)
					console.log(`试卷图片 ${i + 1} 上传成功:`, uploadResult.fileID)
				} catch (uploadError) {
					console.error(`试卷图片 ${i + 1} 上传失败:`, uploadError)
					throw new Error(`试卷图片 ${i + 1} 上传失败`)
				}
			}
		}
		
		// 上传分析图片
		if (analysisImages && Array.isArray(analysisImages)) {
			for (let i = 0; i < analysisImages.length; i++) {
				const imageData = analysisImages[i]
				const fileName = `analysis_images/${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}.jpg`
				
				try {
					// 将base64数据写入临时文件
					const tempFilePath = `/tmp/temp_${Date.now()}_${i}.jpg`
					const fs = require('fs')
					
					// 移除data:image/jpeg;base64,前缀
					const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, '')
					const buffer = Buffer.from(base64Data, 'base64')
					
					fs.writeFileSync(tempFilePath, buffer)
					
					const uploadResult = await uniCloud.uploadFile({
						filePath: tempFilePath,
						cloudPath: fileName
					})
					
					// 删除临时文件
					fs.unlinkSync(tempFilePath)
					
					analysisImageFileIDs.push(uploadResult.fileID)
					console.log(`分析图片 ${i + 1} 上传成功:`, uploadResult.fileID)
				} catch (uploadError) {
					console.error(`分析图片 ${i + 1} 上传失败:`, uploadError)
					throw new Error(`分析图片 ${i + 1} 上传失败`)
				}
			}
		}
		
		return {
			code: 0,
			message: '图片上传成功',
			data: {
				examImageFileIDs,
				analysisImageFileIDs
			}
		}
		
	} catch (error) {
		console.error('图片上传失败:', error)
		return {
			code: -1,
			message: error.message || '图片上传失败，请重试'
		}
	}
} 