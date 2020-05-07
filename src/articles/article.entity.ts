import { Column, Entity, ObjectIdColumn } from 'typeorm'

@Entity('articles')
export class Article {
  @ObjectIdColumn()
  _id: string

  @Column()
  headline: string

  @Column()
  ankeiler: string

  @Column()
  lead: string

  @Column()
  pubDate: Date

  @Column()
  body: string

  @Column()
  breakingNews: boolean
}
