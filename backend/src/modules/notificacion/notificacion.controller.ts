import { Controller, Get, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { AuthUser } from 'src/common/auth/auth-user';
import { NotificacionService } from './notificacion.service';

@UseGuards(JwtAuthGuard)
@Controller('notificacion')
export class NotificacionController {
  constructor(private service: NotificacionService) {}

  @Get()
  list(@CurrentUser() user: AuthUser) {
    return this.service.findForDestinatario(user.tipo, user.sub);
  }

  @Get('unread-count')
  async unreadCount(@CurrentUser() user: AuthUser) {
    const count = await this.service.countUnread(user.tipo, user.sub);
    return { count };
  }

  @Patch(':id/leer')
  markRead(@CurrentUser() user: AuthUser, @Param('id', ParseIntPipe) id: number) {
    return this.service.markAsRead(id, user.tipo, user.sub);
  }

  @Patch('leer-todas')
  markAllRead(@CurrentUser() user: AuthUser) {
    return this.service.markAllAsRead(user.tipo, user.sub);
  }
}
