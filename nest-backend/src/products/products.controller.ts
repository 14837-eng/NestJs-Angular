import { Controller, Post, Body, Get, Param, Patch, Delete, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';

import { ProductsService } from './products.service';
import { AuthGuard } from '../guards/auth.guard';

@Controller('products')
export class ProductsController {
	constructor(private readonly productsService: ProductsService) {}

	@Post()
	@UsePipes(new ValidationPipe())
	addProduct(
		@Body('title') prodTitle: string,
		@Body('description') prodDesc: string,
		@Body('price') prodPrice: number
	) {
		const generatedId = this.productsService.insertProduct(prodTitle, prodDesc, prodPrice);
		return { id: generatedId };
	}

	@Get()
	@UseGuards(AuthGuard)
	getAllProducts() {
		return this.productsService.getProducts();
	}

	@Get(':id')
	getProduct(@Param('id') prodId: string) {
		return this.productsService.getSingleProduct(prodId);
	}

	@Patch(':id')
	updateProduct(
		@Param('id') prodId: string,
		@Body('title') prodTitle: string,
		@Body('description') prodDesc: string,
		@Body('price') prodPrice: number
	) {
		this.productsService.updateProduct(prodId, prodTitle, prodDesc, prodPrice);
		return null;
	}

	@Delete(':id')
	removeProduct(@Param('id') prodId: string) {
		this.productsService.deleteProduct(prodId);
		return null;
	}
}
