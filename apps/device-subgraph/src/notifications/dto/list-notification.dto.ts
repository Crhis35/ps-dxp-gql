import { PaginationOffsetInput } from '@lib/mikro-orm-pg/common/dto/pagination.dto';
import { InputType } from '@nestjs/graphql';

@InputType()
export class NotificationPaginationInput extends PaginationOffsetInput {}
