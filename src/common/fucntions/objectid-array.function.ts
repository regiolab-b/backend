import { ObjectId } from 'mongodb'

export function ObjectIdArray(array: string[]): ObjectId[] {
  return array.map(value => new ObjectId(value))
}
