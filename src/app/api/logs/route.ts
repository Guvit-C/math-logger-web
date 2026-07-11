import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const code = formData.get('code') as string;
    const paper = formData.get('paper') as string;
    const topic = formData.get('topic') as string;
    const subtopic = formData.get('subtopic') as string;
    const reason = formData.get('reason') as string;
    const isImportant = formData.get('isImportant') === 'true';
    const images = formData.getAll('image') as File[];

    const markSchemeImages = formData.getAll('markScheme') as File[];
    
    if (!code || !paper || !topic || !subtopic || images.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const imageUrls = [];
    for (let i = 0; i < images.length; i++) {
      if (images[i].size === 0) continue;
      const image = images[i];
      const ext = image.name.split('.').pop() || 'png';
      const filename = `${code}_${Date.now()}_${i}.${ext}`;
      
      const { error } = await supabase
        .storage
        .from('question-images')
        .upload(filename, image, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (error) {
        console.error('Upload error:', error);
        throw error;
      }
      
      const { data: publicUrlData } = supabase
        .storage
        .from('question-images')
        .getPublicUrl(filename);
        
      imageUrls.push(publicUrlData.publicUrl);
    }
    
    // Process Mark Scheme images if any exist
    const markSchemeUrls = [];
    for (let i = 0; i < markSchemeImages.length; i++) {
      if (markSchemeImages[i].size === 0) continue;
      const image = markSchemeImages[i];
      const ext = image.name.split('.').pop() || 'png';
      const filename = `ms_${code}_${Date.now()}_${i}.${ext}`;
      
      const { error } = await supabase
        .storage
        .from('question-images')
        .upload(filename, image, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (error) throw error;
      
      const { data: publicUrlData } = supabase
        .storage
        .from('question-images')
        .getPublicUrl(filename);
        
      markSchemeUrls.push(publicUrlData.publicUrl);
    }

    const { data: insertData, error: insertError } = await supabase
      .from('questions')
      .insert([
        {
          code,
          paper,
          topic,
          subtopic,
          reason: reason || '',
          image_urls: imageUrls,
          mark_scheme_urls: markSchemeUrls,
          is_important: isImportant
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      throw insertError;
    }

    // Map DB fields back to what frontend expects
    const newLog = {
      id: insertData.id,
      code: insertData.code,
      paper: insertData.paper,
      topic: insertData.topic,
      subtopic: insertData.subtopic,
      reason: insertData.reason,
      isImportant: insertData.is_important || false,
      imageUrl: insertData.image_urls[0],
      imageUrls: insertData.image_urls,
      createdAt: insertData.created_at
    };

    return NextResponse.json({ success: true, log: newLog });
  } catch (error) {
    console.error('Error saving log:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .order('created_at', { ascending: true });
      
    if (error) throw error;
    
    // Map DB fields to frontend expectations
    const logs = data.map((d: any) => ({
      id: d.id,
      code: d.code,
      paper: d.paper,
      topic: d.topic,
      subtopic: d.subtopic,
      reason: d.reason,
      isImportant: d.is_important || false,
      imageUrl: d.image_urls && d.image_urls.length > 0 ? d.image_urls[0] : '',
      imageUrls: d.image_urls,
      markSchemeUrls: d.mark_scheme_urls || [],
      revisionHistory: d.revision_history || [],
      createdAt: d.created_at
    }));

    return NextResponse.json({ logs });
  } catch (error) {
    console.error('Error fetching logs:', error);
    return NextResponse.json({ logs: [] });
  }
}
