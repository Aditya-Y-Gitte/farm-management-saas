using CatalogApi.DTOs;
using CatalogApi.Models;
using CatalogApi.Repositories;

using FarmManagement.SharedKernel.Models;
using Mapster;
using Microsoft.Extensions.Logging;

namespace CatalogApi.Services;

public class HealthRecordService : IHealthRecordService
{
    private readonly IHealthRecordRepository _repository;
    private readonly ILivestockRepository _livestockRepository;
    private readonly ILogger<HealthRecordService> _logger;

    public HealthRecordService(
        IHealthRecordRepository repository,
        ILivestockRepository livestockRepository,
        ILogger<HealthRecordService> logger)
    {
        _repository = repository;
        _livestockRepository = livestockRepository;
        _logger = logger;
    }

    public async Task<PagedResponse<HealthRecordDto>> GetAllAsync(int page, int pageSize)
    {
        var (items, totalCount) = await _repository.GetAllAsync(page, pageSize);
        var dtos = items.Select(i => i.Adapt<HealthRecordDto>());
        return PagedResponse<HealthRecordDto>.Create(dtos, totalCount, page, pageSize);
    }

    public async Task<PagedResponse<HealthRecordDto>> GetByLivestockIdAsync(Guid livestockId, int page, int pageSize)
    {
        // Optional: Ensure livestock exists, though returning an empty list is also fine.
        var (items, totalCount) = await _repository.GetByLivestockIdAsync(livestockId, page, pageSize);
        var dtos = items.Select(i => i.Adapt<HealthRecordDto>());
        return PagedResponse<HealthRecordDto>.Create(dtos, totalCount, page, pageSize);
    }

    public async Task<HealthRecordDto?> GetByIdAsync(Guid id)
    {
        var entity = await _repository.GetByIdAsync(id);
        return entity?.Adapt<HealthRecordDto>();
    }

    public async Task<HealthRecordDto> CreateAsync(CreateHealthRecordRequest request)
    {
        // Enforce that livestock belongs to this tenant (implicitly checked if GetByIdAsync applies query filters)
        var livestock = await _livestockRepository.GetByIdAsync(request.LivestockId);
        if (livestock == null)
        {
            throw new KeyNotFoundException($"Livestock with ID {request.LivestockId} not found or does not belong to the tenant.");
        }

        var entity = new HealthRecord
        {
            LivestockId = request.LivestockId,
            Date = request.Date,
            Type = request.Type,
            Description = request.Description,
            Diagnosis = request.Diagnosis,
            Treatment = request.Treatment,
            Medication = request.Medication,
            Veterinarian = request.Veterinarian,
            Notes = request.Notes
        };

        var created = await _repository.CreateAsync(entity);
        return created.Adapt<HealthRecordDto>();
    }

    public async Task<HealthRecordDto> UpdateAsync(Guid id, UpdateHealthRecordRequest request)
    {
        var entity = await _repository.GetByIdAsync(id);
        if (entity == null)
        {
            throw new KeyNotFoundException($"HealthRecord with ID {id} not found.");
        }

        // If LivestockId is changing, ensure new Livestock exists and belongs to the tenant
        if (entity.LivestockId != request.LivestockId)
        {
            var livestock = await _livestockRepository.GetByIdAsync(request.LivestockId);
            if (livestock == null)
            {
                throw new KeyNotFoundException($"Livestock with ID {request.LivestockId} not found or does not belong to the tenant.");
            }
        }

        entity.LivestockId = request.LivestockId;
        entity.Date = request.Date;
        entity.Type = request.Type;
        entity.Description = request.Description;
        entity.Diagnosis = request.Diagnosis;
        entity.Treatment = request.Treatment;
        entity.Medication = request.Medication;
        entity.Veterinarian = request.Veterinarian;
        entity.Notes = request.Notes;

        var updated = await _repository.UpdateAsync(entity);
        return updated.Adapt<HealthRecordDto>();
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        return await _repository.DeleteAsync(id);
    }
}
