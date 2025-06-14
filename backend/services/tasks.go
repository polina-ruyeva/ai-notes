package services

import (
	"backend/models"
	"time"

	"gorm.io/gorm"
)

type TaskService struct {
	DB *gorm.DB
}

func NewTaskService(db *gorm.DB) *TaskService {
	return &TaskService{DB: db}
}

func (s *TaskService) GetAllTasks() ([]models.Task, error) {
	var tasks []models.Task
	result := s.DB.Find(&tasks)
	return tasks, result.Error
}

func (s *TaskService) CreateTask(req models.CreateTaskRequest) (*models.Task, error) {
	if req.Status == "" {
		req.Status = "TODO"
	}

	task := models.Task{
		Title:       req.Title,
		Description: req.Description,
		Status:      req.Status,
	}

	result := s.DB.Create(&task)
	if result.Error != nil {
		return nil, result.Error
	}

	return &task, nil
}

func (s *TaskService) GetTaskByID(id string) (*models.Task, error) {
	var task models.Task
	result := s.DB.First(&task, "id = ?", id)
	if result.Error != nil {
		return nil, result.Error
	}
	return &task, nil
}

func (s *TaskService) UpdateTask(id string, req models.UpdateTaskRequest) (*models.Task, error) {
	var task models.Task
	if err := s.DB.First(&task, "id = ?", id).Error; err != nil {
		return nil, err
	}

	updateData := make(map[string]interface{})
	if req.Title != nil {
		updateData["title"] = *req.Title
	}
	if req.Description != nil {
		updateData["description"] = *req.Description
	}
	if req.Status != nil {
		updateData["status"] = *req.Status
	}

	if err := s.DB.Model(&task).Updates(updateData).Error; err != nil {
		return nil, err
	}

	s.DB.First(&task, "id = ?", id)
	return &task, nil
}

func (s *TaskService) DeleteTask(id string) error {
	result := s.DB.Delete(&models.Task{}, "id = ?", id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

func (s *TaskService) GenerateAiNote(id string) (string, error) {
	var task models.Task
	if err := s.DB.First(&task, "id = ?", id).Error; err != nil {
		return "", err
	}

	time.Sleep(2 * time.Second)

	aiNote := "some ai-generated content"

	updateData := map[string]interface{}{
		"ai_note":    aiNote,
		"updated_at": time.Now(),
	}

	if err := s.DB.Model(&task).Updates(updateData).Error; err != nil {
		return "", err
	}

	return aiNote, nil
}
