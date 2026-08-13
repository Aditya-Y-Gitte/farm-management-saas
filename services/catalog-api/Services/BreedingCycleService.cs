using CatalogApi.DTOs;
using CatalogApi.Models;
using CatalogApi.Repositories;
using FarmManagement.SharedKernel.Exceptions;
using FarmManagement.SharedKernel.Models;
using Mapster;
using Microsoft.Extensions.Logging;

namespace CatalogApi.Services;

public class BreedingCycleService : IBreedingCycleService
{
    private readonly IBreedingCycleRepository _repository;
    private readonly ILivestockRepository _livestockRepository;
    private readonly ILogger<BreedingCycleService> _logger;

    public BreedingCycleService(
        IBreedingCycleRepository repository,
        ILivestockRepository livestockRepository,
        ILogger<BreedingCycleService> logger)
    {
        _repository = repository;
        _livestockRepository = livestockRepository;
        _logger = logger;
    }

    public async Task<PagedResponse<BreedingCycleDto>> GetAllAsync(int page, int pageSize)
    {
        var (items, totalCount) = await _repository.GetAllAsync(page, pageSize);
        var dtos = items.Select(i => i.Adapt<BreedingCycleDto>());
        return PagedResponse<BreedingCycleDto>.Create(dtos, totalCount, page, pageSize);
    }

    public async Task<PagedResponse<BreedingCycleDto>> GetByLivestockIdAsync(Guid livestockId, int page, int pageSize)
    {
        var (items, totalCount) = await _repository.GetByLivestockIdAsync(livestockId, page, pageSize);
        var dtos = items.Select(i => i.Adapt<BreedingCycleDto>());
        return PagedResponse<BreedingCycleDto>.Create(dtos, totalCount, page, pageSize);
    }

    public async Task<BreedingCycleDto?> GetByIdAsync(Guid id)
    {
        var entity = await _repository.GetByIdAsync(id);
        return entity?.Adapt<BreedingCycleDto>();
    }

    public async Task<BreedingCycleDto> CreateAsync(CreateBreedingCycleRequest request)
    {
        // Enforce tenant boundary validation
        var livestock = await _livestockRepository.GetByIdAsync(request.LivestockId);
        if (livestock == null)
        {
            throw new NotFoundException($"Livestock with ID {request.LivestockId} not found or does not belong to the tenant.");
        }

        var entity = new BreedingCycle
        {
            LivestockId = request.LivestockId,
            BreedingDate = request.BreedingDate,
            Method = request.Method,
            ExpectedDeliveryDate = request.ExpectedDeliveryDate,
            ActualDeliveryDate = request.ActualDeliveryDate,
            Status = request.Status,
            Notes = request.Notes
        };

        var created = await _repository.CreateAsync(entity);
        return created.Adapt<BreedingCycleDto>();
    }

    public async Task<BreedingCycleDto> UpdateAsync(Guid id, UpdateBreedingCycleRequest request)
    {
        var entity = await _repository.GetByIdAsync(id);
        if (entity == null)
        {
            throw new NotFoundException($"BreedingCycle with ID {id} not found.");
        }

        if (entity.LivestockId != request.LivestockId)
        {
            var livestock = await _livestockRepository.GetByIdAsync(request.LivestockId);
            if (livestock == null)
            {
                throw new NotFoundException($"Livestock with ID {request.LivestockId} not found or does not belong to the tenant.");
            }
        }

        entity.LivestockId = request.LivestockId;
        entity.BreedingDate = request.BreedingDate;
        entity.Method = request.Method;
        entity.ExpectedDeliveryDate = request.ExpectedDeliveryDate;
        entity.ActualDeliveryDate = request.ActualDeliveryDate;
        entity.Status = request.Status;
        entity.Notes = request.Notes;

        var updated = await _repository.UpdateAsync(entity);
        return updated.Adapt<BreedingCycleDto>();
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        return await _repository.DeleteAsync(id);
    }
}
