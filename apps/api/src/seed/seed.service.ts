import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/user.entity';
import { Entry } from '../entries/entry.entity';
import { Tag } from '../tags/tag.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Entry) private entryRepo: Repository<Entry>,
    @InjectRepository(Tag) private tagRepo: Repository<Tag>,
  ) {}

  async onModuleInit() {
    const count = await this.userRepo.count();
    if (count > 0) return;

    console.log('Seeding MindLog data...');

    const hash = await bcrypt.hash('password123', 10);
    const user = this.userRepo.create({
      username: 'cristian',
      email: 'cristian@mindlog.app',
      passwordHash: hash,
      displayName: 'Cristian',
    } as any);
    const savedUser = await this.userRepo.save(user) as unknown as User;

    const tagData = [
      { name: 'trabajo', color: '#4f46e5' },
      { name: 'personal', color: '#0891b2' },
      { name: 'salud', color: '#059669' },
      { name: 'aprendizaje', color: '#d97706' },
      { name: 'proyectos', color: '#dc2626' },
      { name: 'social', color: '#7c3aed' },
      { name: 'ejercicio', color: '#16a34a' },
      { name: 'lectura', color: '#2563eb' },
    ];

    const tags: Tag[] = [];
    for (const t of tagData) {
      const tag = this.tagRepo.create({ ...t, userId: savedUser.id } as any);
      tags.push(await this.tagRepo.save(tag) as unknown as Tag);
    }

    const entries = [
      {
        date: '2026-07-07', mood: 4, title: 'Primer dia del proyecto MindLog',
        content: `Hoy empece a planificar MindLog. Una aplicacion para llevar un diario personal con seguimiento de estado de animo. Me gusta la idea de tener un espacio para reflexionar cada dia.
Tecnologia: Angular 22 + NestJS + SQLite. Va a ser un proyecto muy completo.`
      },
      {
        date: '2026-07-08', mood: 3, title: 'Configuracion del monorepo',
        content: `Trabajando en la configuracion del monorepo con npm workspaces. Algunos problemas con las versiones de TypeScript entre Angular y NestJS, pero logre resolverlo.
Manana empiezo con las entidades del backend.`
      },
      {
        date: '2026-07-10', mood: 5, title: 'Backend funcionando',
        content: `El backend ya funciona con TypeORM y SQLite. Las entidades User, Entry y Tag estan listas. Tambien implemente la autenticacion JWT.
Me siento muy bien con el progreso. La API de analytics para tendencias de humor esta especialmente interesante.`
      },
      {
        date: '2026-07-12', mood: 2, title: 'Problemas con el frontend',
        content: `El frontend no compila. Hay un error con las senales de Angular y los formularios reactivos. Pase horas debugueando sin exito.
Creo que el problema esta en la importacion de FormsModule. Lo resolvere manana con calma.`
      },
      {
        date: '2026-07-14', mood: 4, title: 'Frontend arreglado',
        content: `El frontend compila! El error era que faltaba importar ReactiveFormsModule en el componente standalone. Una tonteria que me costo dos dias encontrar.
Ahora la vista de calendario funciona y muestra los moods con colores.`
      },
      {
        date: '2026-07-15', mood: 5, title: 'Primera version completa',
        content: `MindLog tiene su primera version funcional:
- Login/registro con JWT
- Editor de entradas con markdown
- Calendario con indicadores de humor
- Analytics con tendencias y rachas
- Gestion de tags
Estoy muy orgulloso del resultado.`
      },
      {
        date: '2026-07-18', mood: 3, title: 'Refactorizando el codigo',
        content: `Dia de refactor. El servicio de analytics era muy monolitico, lo dividi en funciones mas pequenas. Tambien mejore las queries de TypeORM para que sean mas eficientes.
El codigo queda mas limpio pero siempre hay mas por mejorar.`
      },
      {
        date: '2026-07-20', mood: 4, title: 'Anadiendo exportacion de datos',
        content: `Implemente la exportacion de entradas a JSON y CSV. Util para hacer backups o analisis externos.
Tambien anadi un modo oscuro que respeta la preferencia del sistema.`
      },
      {
        date: '2026-07-22', mood: 2, title: 'Dia gris',
        content: `Hoy no fue un buen dia. Mucho estres en el trabajo y poco tiempo para MindLog. A veces siento que avanzo muy lento con los proyectos.
Pero escribirlo ya ayuda. Manana sera mejor.`
      },
      {
        date: '2026-07-25', mood: 4, title: 'Nuevos iconos y UI',
        content: `Disene los iconos de estado de animo. Ahora son mas expresivos y se ven mejor en el calendario. Tambien mejore la tipografia del editor.
La app se ve mucho mas profesional ahora.`
      },
      {
        date: '2026-07-28', mood: 5, title: '100 entradas!',
        content: `Acabo de llegar a 100 entradas en MindLog. Es increible ver el progreso. Las graficas de tendencias muestran que mi estado de animo ha mejorado en el ultimo mes.
La racha actual es de 12 dias consecutivos. A seguir!`
      },
      {
        date: '2026-07-30', mood: 3, title: 'Preparando documentacion',
        content: `Escribiendo la documentacion de la API con Swagger. Los endpoints estan bien organizados y las responses son claras.
Tambien cree un ARCHITECTURE.md para que cualquiera pueda entender la estructura del proyecto.`
      },
      {
        date: '2026-08-01', mood: 4, title: 'Mes nuevo, energia renovada',
        content: `Agosto empieza bien. MindLog esta estable y lo uso a diario. Los tags de "ejercicio" y "lectura" son los que mas aparecen este mes.
Quiero anadir notificaciones para recordar escribir cada dia.`
      },
      {
        date: '2026-08-03', mood: 2, title: 'Dia de descanso forzado',
        content: `Me quede sin bateria en el portatil y perdi una entrada que estaba escribiendo. Necesito implementar auto-guardado.
Por lo menos fue un buen recordatorio de lo importante que es tener backups.`
      },
      {
        date: '2026-08-05', mood: 5, title: 'Auto-guardado implementado',
        content: `Ya tengo auto-guardado en el editor de entradas. Cada 30 segundos guarda un borrador en localStorage. Si cierras sin querer, recuperas el texto.
Satisfecho con esta feature. MindLog cada dia esta mas completo.`
      },
      {
        date: '2026-08-07', mood: 4, title: 'MindLog desplegado',
        content: `MindLog ya esta en produccion. El frontend en proyectos.cristiancode.dev y la API en el VPS. Todo funcionando con Neon PostgreSQL.
Han sido semanas de trabajo pero valio la pena. Una herramienta que realmente uso a diario.`
      },
    ];

    for (const e of entries) {
      let entryTags: Tag[];
      if (['2026-07-07', '2026-07-10', '2026-07-15', '2026-07-28', '2026-08-05', '2026-08-07'].includes(e.date)) {
        entryTags = [tags[3]]; // aprendizaje
      } else if (e.date === '2026-07-14') {
        entryTags = [tags[1]]; // personal
      } else if (e.date === '2026-07-20') {
        entryTags = [tags[0]]; // trabajo
      } else if (e.date === '2026-07-22') {
        entryTags = [tags[2]]; // salud
      } else if (e.date === '2026-08-01') {
        entryTags = [tags[1], tags[6]]; // personal + ejercicio
      } else {
        entryTags = [tags[Math.floor(Math.random() * tags.length)]];
      }

      const entry = this.entryRepo.create({
        userId: savedUser.id,
        date: e.date,
        title: e.title,
        content: e.content,
        mood: e.mood,
        tags: entryTags,
      } as any);
      await this.entryRepo.save(entry) as unknown as Entry;
    }

    console.log(`Seeded: 1 user, ${tags.length} tags, ${entries.length} entries`);
  }
}
