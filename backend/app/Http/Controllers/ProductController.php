<?php
namespace App\Http\Controllers;

use App\Models\Product;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use League\Csv\Writer;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::where('user_id', auth()->id())
            ->paginate(10);
        return response()->json($products);
    }

    public function show(Product $product)
    {
        if ($product->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        return response()->json($product);
    }

    public function store(StoreProductRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = auth()->id();
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $data['image_url'] = '/storage/' . $path;
        } else {
            $data['image_url'] = '';
        }
        $product = Product::create($data);
        return response()->json($product, 201);
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $data = $request->validated();
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $data['image_url'] = '/storage/' . $path;
        }
        $product->update($data);
        return response()->json($product);
    }

    public function destroy(Product $product)
    {
        if ($product->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $product->delete();
        return response()->json(['message' => 'Product deleted']);
    }

    public function exportCsv(Request $request)
    {
        $products = Product::where('user_id', auth()->id())->get();
        $csv = Writer::createFromString();
        $csv->insertOne(['name', 'image_url', 'description', 'price']);
        foreach ($products as $product) {
            $csv->insertOne([
                $product->name,
                $product->image_url,
                $product->description,
                $product->price,
            ]);
        }
        return response($csv->toString(), 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="products.csv"',
        ]);
    }
}