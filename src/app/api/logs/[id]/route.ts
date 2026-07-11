import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Get the log to know which images to delete
    const { data: log, error: fetchError } = await supabase
      .from('questions')
      .select('*')
      .eq('id', id)
      .single();
      
    if (fetchError || !log) {
      return NextResponse.json({ error: 'Log not found' }, { status: 404 });
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from('questions')
      .delete()
      .eq('id', id);
      
    if (deleteError) {
      throw deleteError;
    }

    // Delete images from storage
    if (log.image_urls && log.image_urls.length > 0) {
      const filenames = log.image_urls.map((url: string) => {
        // extract filename from public URL
        const parts = url.split('/');
        return parts[parts.length - 1];
      });
      
      await supabase.storage.from('question-images').remove(filenames);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting log:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await request.json();
      if (body.revision_history !== undefined) {
        const { data, error } = await supabase
          .from('questions')
          .update({ revision_history: body.revision_history })
          .eq('id', id)
          .select()
          .single();
          
        if (error) throw error;
        return NextResponse.json({ success: true, log: data });
      }
      return NextResponse.json({ error: 'Missing revision_history' }, { status: 400 });
    }

    const formData = await request.formData();
    
    const code = formData.get('code') as string;
    const paper = formData.get('paper') as string;
    const topic = formData.get('topic') as string;
    const subtopic = formData.get('subtopic') as string;
    const reason = formData.get('reason') as string;
    const isImportant = formData.get('isImportant') === 'true';
    
    const existingImagesStr = formData.get('existingImages') as string;
    
    const newImages = formData.getAll('new_image') as File[];

    if (!code || !paper || !topic || !subtopic) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let existingImages: string[] = [];
    try {
      if (existingImagesStr) existingImages = JSON.parse(existingImagesStr);
    } catch(e) { console.error("Error parsing existing images array", e); }

    const imageUrls = [...existingImages];
    for (let i = 0; i < newImages.length; i++) {
      const image = newImages[i];
      if (image.size === 0) continue;
      const ext = image.name.split('.').pop() || 'png';
      const filename = `${code}_${Date.now()}_${i}.${ext}`;
      const { error } = await supabase.storage.from('question-images').upload(filename, image, { cacheControl: '3600', upsert: false });
      if (error) throw error;
      const { data: publicUrlData } = supabase.storage.from('question-images').getPublicUrl(filename);
      imageUrls.push(publicUrlData.publicUrl);
    }

    const { data, error } = await supabase
      .from('questions')
      .update({
        code,
        paper,
        topic,
        subtopic,
        reason: reason || '',
        is_important: isImportant,
        image_urls: imageUrls
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, log: data });
  } catch (error) {
    console.error('Error updating log:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
