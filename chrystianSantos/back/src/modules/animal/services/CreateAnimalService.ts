import { IPeopleRepository } from '@modules/people/repositories/IPeopleRepository';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { ICreateAnimalDTO } from '../dtos/ICreateAnimalDTO';
import { Animal } from '../infra/typeorm/entities/Animal';
import { IAnimalRepository } from '../repositories/IAnimalRepository';

@injectable()
export class CreateAnimalService {
  constructor(
    @inject('AnimalRepository')
    private animalRepository: IAnimalRepository,
    @inject('PeopleRepository')
    private peopleRepository: IPeopleRepository,
  ) {}

  public async execute({
    born,
    id_people,
    breed,
    sex,
    name,
    weigth,
  }: ICreateAnimalDTO): Promise<Animal> {
    const findPeople = await this.peopleRepository.findById(id_people);

    if (!findPeople) {
      throw new AppError('Pessoa não encontrada', 404);
    }

    const animalCreate = await this.animalRepository.create({
      born,
      weigth,
      name,
      sex,
      breed,
      id_people,
    });

    const animalSave = await this.animalRepository.save(animalCreate);

    return animalSave;
  }
}
