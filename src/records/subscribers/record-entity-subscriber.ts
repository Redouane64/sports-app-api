import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { Record } from '../entities/record.entity';
import { RecordProcessorService } from '../record-processor.service';
import { DataSource } from 'typeorm';

@EventSubscriber()
export class RecordEntitySubscriber
  implements EntitySubscriberInterface<Record>
{
  constructor(
    private readonly dataSource: DataSource,
    private readonly recordProcessorService: RecordProcessorService,
  ) {
    this.dataSource.subscribers.push(this);
  }

  listenTo() {
    return Record;
  }

  afterInsert(event: InsertEvent<Record>) {
    void this.recordProcessorService.process(event.entity.id);
  }
}
