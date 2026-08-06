import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../users/user.entity';
import { Tag } from '../tags/tag.entity';

@Entity()
export class Entry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, u => u.entries)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'integer', default: 3 })
  mood: number;

  @Column({ nullable: true })
  title: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Tag, t => t.entries)
  @JoinTable({ name: 'entry_tags', joinColumn: { name: 'entryId' }, inverseJoinColumn: { name: 'tagId' } })
  tags: Tag[];
}
