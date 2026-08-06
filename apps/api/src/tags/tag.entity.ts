import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, ManyToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Entry } from '../entries/entry.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  color: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, u => u.tags)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToMany(() => Entry, e => e.tags)
  entries: Entry[];

  @CreateDateColumn()
  createdAt: Date;
}
