import { User } from 'src/modules/user/entities/user.entity'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm'

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ default: '' })
  ext: string

  @Column({ default: '' })
  type: string

  @Column({ default: '' })
  url: string

  @Column({ default: false })
  isDir: boolean

  @Column({ default: null })
  dirId: number

  @ManyToOne(() => User, (user) => user.files)
  user: User

  @Column({ default: 0 })
  size: number

  @CreateDateColumn()
  createAt: Date

  @UpdateDateColumn()
  updateAt: Date
}
