import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { getUser } from 'src/common/decorators/get-user-decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ResultUploadDto } from './dto/result-upload.dto';
import { ResultService } from './result.service';
@ApiTags('Result')
@ApiBearerAuth()
@Controller('result')
@UseGuards(JwtAuthGuard)
export class ResultController {
  constructor(private readonly resultService: ResultService) {}

  @Get('parties')
  async getAllParties() {
    return await this.resultService.getAllParties();
  }

  @Post('upload-result')
  @UseInterceptors(FileInterceptor('result'))
  @ApiConsumes('multipart/form-data')
  async createResult(
    @UploadedFile()
    result: Express.Multer.File,
    @Body() resultUploadDto: ResultUploadDto,
    @getUser('email') email: string,
  ) {
    if (!result) throw new BadRequestException('Result field is required');
    return this.resultService.createResult(
      { ...resultUploadDto, result },
      email,
    );
  }

  @Get('get-user-results')
  async getResultByUser(@getUser('email') email: string) {
    return this.resultService.getResultByUser(email);
  }

  @Get('get-single-result/:id')
  async getSingelResult(@Param('id') id: string) {
    return this.resultService.getSingleResult(id);
  }

  @Delete('delete/:id')
  async deleteResult(@Param('id') id: string) {
    return this.resultService.deleteResult(id);
  }
}
