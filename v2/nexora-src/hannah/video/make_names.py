"""
The visitors' names Hannah can say (one short video clip each: "Divya!").

The user chose sample B on 2026-11-18: Indian names are read by Kokoro's own voice af_bella with the
Hindi pronunciation rules (lang 'h', written in Devanagari), so they sound like her and are said the
Indian way. International names use the English rules (lang 'a', sample A).

Each line:  Latin spelling | Devanagari | other spellings people type (optional, space separated)
Every spelling (and the Devanagari) points to the same clip. A name that isn't here: she simply
says the sentence without it.

Run:  python3 make_names.py   → names.json  [{id, key, say, lang, aliases}]
Add names at the end of a list and run again: existing ids never change.
"""
import json, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'names.json')

INDIAN = """
Aaradhya|आराध्या|Aradhya
Aarti|आरती|Arti Aarthi Arthi
Aditi|अदिति|
Aishwarya|ऐश्वर्या|Aishwariya Ishwarya
Akanksha|आकांक्षा|Aakanksha
Alka|अलका|
Amrita|अमृता|Amritha
Ananya|अनन्या|
Anita|अनीता|Anitha Aneeta
Anjali|अंजलि|Anjalee
Ankita|अंकिता|
Anu|अनु|
Anupama|अनुपमा|
Anusha|अनुषा|
Aparna|अपर्णा|
Archana|अर्चना|
Arpita|अर्पिता|
Asha|आशा|
Ashwini|अश्विनी|Aswini Ashvini
Bhavana|भावना|Bhavna
Bhumika|भूमिका|
Chandni|चांदनी|
Chitra|चित्रा|
Deepa|दीपा|
Deepika|दीपिका|
Devika|देविका|
Dhanya|धन्या|
Disha|दिशा|
Divya|दिव्या|Dhivya Divyaa
Durga|दुर्गा|
Fatima|फ़ातिमा|Fathima
Gauri|गौरी|Gowri
Gayatri|गायत्री|Gayathri
Geeta|गीता|Geetha Gita
Hema|हेमा|
Indu|इंदु|
Isha|ईशा|
Jaya|जया|
Jyoti|ज्योति|Jyothi
Kajal|काजल|
Kalpana|कल्पना|
Kamala|कमला|
Kavita|कविता|Kavitha
Kavya|काव्या|Kaavya
Keerthi|कीर्ति|Kirti Kirthi
Keerthana|कीर्तना|Kirthana
Komal|कोमल|
Kritika|कृतिका|Krithika Kruthika
Lakshmi|लक्ष्मी|Laxmi Lakshmy
Lata|लता|Latha
Madhuri|माधुरी|
Mahima|महिमा|
Malini|मालिनी|
Mamta|ममता|Mamata Mamatha
Manisha|मनीषा|
Maya|माया|
Meena|मीना|
Meera|मीरा|Mira
Megha|मेघा|
Mehak|महक|
Monika|मोनिका|Monica
Nandini|नंदिनी|
Neha|नेहा|
Nidhi|निधि|
Nikita|निकिता|
Nisha|निशा|
Nitya|नित्या|Nithya
Padma|पद्मा|
Pallavi|पल्लवी|
Pooja|पूजा|Puja
Poonam|पूनम|
Prachi|प्राची|
Pragya|प्रज्ञा|
Pratibha|प्रतिभा|
Preeti|प्रीति|Priti Preethi
Priya|प्रिया|
Priyanka|प्रियंका|
Radha|राधा|
Radhika|राधिका|
Rani|रानी|
Rashmi|रश्मि|
Rekha|रेखा|
Renu|रेणु|
Revathi|रेवती|Revati
Riya|रिया|Ria
Ritu|ऋतु|Rithu
Rohini|रोहिणी|
Ruchi|रुचि|
Rupa|रूपा|Roopa
Sakshi|साक्षी|
Sangeeta|संगीता|Sangeetha
Sanjana|संजना|
Sapna|सपना|
Sara|सारा|
Sarita|सरिता|
Savita|सविता|Savitha
Seema|सीमा|
Shalini|शालिनी|
Shanti|शांति|Shanthi
Sharmila|शर्मिला|
Shilpa|शिल्पा|
Shobha|शोभा|
Shreya|श्रेया|Sreya
Shruti|श्रुति|Shruthi Sruthi
Shweta|श्वेता|Swetha Shwetha Sweta
Simran|सिमरन|
Smita|स्मिता|Smitha
Sneha|स्नेहा|
Sonal|सोनल|
Sonia|सोनिया|Sonya
Suman|सुमन|
Sunita|सुनीता|Sunitha
Supriya|सुप्रिया|
Sushma|सुषमा|
Swati|स्वाति|Swathi
Tanvi|तन्वी|
Tanya|तान्या|
Uma|उमा|
Usha|उषा|
Vaishnavi|वैष्णवी|
Vandana|वंदना|
Varsha|वर्षा|
Vidya|विद्या|
Vijaya|विजया|
Vinita|विनीता|Vineetha Vinitha
Yamini|यामिनी|
Zara|ज़ारा|
Zoya|ज़ोया|
Ayesha|आयशा|Aisha Aysha
Sana|सना|
Nazia|नाज़िया|
Shabnam|शबनम|
Farah|फ़राह|
Hina|हिना|Heena
Mumtaz|मुमताज़|
Noor|नूर|
Harpreet|हरप्रीत|
Gurpreet|गुरप्रीत|
Jaspreet|जसप्रीत|
Manpreet|मनप्रीत|
Navneet|नवनीत|
Kiran|किरण|
Parminder|परमिंदर|
Aarohi|आरोही|
Anvi|अन्वी|
Avni|अवनी|
Diya|दिया|
Ira|इरा|
Ishita|इशिता|
Jahnavi|जाह्नवी|Jhanvi Janhavi
Khushi|ख़ुशी|Kushi
Kriti|कृति|
Mansi|मानसी|Maansi
Myra|मायरा|
Navya|नव्या|
Pari|परी|
Prisha|प्रिशा|
Saanvi|सान्वी|Sanvi
Shanaya|शनाया|
Siya|सिया|
Tara|तारा|
Trisha|तृषा|
Vanya|वान्या|
Bhavya|भव्या|
Charu|चारु|
Ekta|एकता|
Garima|गरिमा|
Kanika|कनिका|
Lavanya|लावण्या|
Mitali|मिताली|
Namrata|नम्रता|
Payal|पायल|Payel
Rachana|रचना|Rachna
Rakhi|राखी|
Reena|रीना|
Sadhana|साधना|
Sharda|शारदा|Sharada
Sudha|सुधा|
Sujata|सुजाता|Sujatha
Sunanda|सुनंदा|
Tejaswini|तेजस्विनी|
Urmila|उर्मिला|
Bindu|बिंदु|
Shobana|शोभना|
Soumya|सौम्या|Sowmya
Ramya|रम्या|
Harini|हरिणी|
Janani|जननी|
Madhavi|माधवी|
Nalini|नलिनी|
Pavithra|पवित्रा|Pavitra
Ranjani|रंजनी|
Saranya|शरण्या|
Sindhu|सिंधु|
Sowjanya|सौजन्या|
Sumathi|सुमति|Sumati
Suganya|सुगन्या|
Swapna|स्वप्ना|
Vasanthi|वसंती|
Vani|वाणी|
Yamuna|यमुना|
Ambika|अंबिका|
Chaitra|चैत्रा|
Deepti|दीप्ति|Deepthi
Hemalatha|हेमलता|Hemlata
Jayashree|जयश्री|Jayasree
Kusuma|कुसुमा|
Manjula|मंजुला|
Parvathi|पार्वती|Parvati
Pushpa|पुष्पा|
Rajeshwari|राजेश्वरी|
Rukmini|रुक्मिणी|
Sridevi|श्रीदेवी|
Tulasi|तुलसी|Tulsi
Veena|वीणा|
Bhavani|भवानी|
Sheela|शीला|Sheila Shila
Leela|लीला|Lila
Reshma|रेशमा|
Sreeja|श्रीजा|
Athira|आतिरा|
Aswathy|अश्वती|Ashwathi
Gopika|गोपिका|
Anju|अंजू|
Lekha|लेखा|
Neetu|नीतू|Neethu Nitu
Remya|रेम्या|
Debjani|देबजानी|
Moumita|मौमिता|
Rituparna|ऋतुपर्णा|
Sharmistha|शर्मिष्ठा|
Sohini|सोहिनी|
Sudeshna|सुदेष्णा|
Tanushree|तनुश्री|
Tanisha|तनीषा|
Mousumi|मौसमी|Mausami
Rupali|रूपाली|
Arundhati|अरुंधति|
Ipsita|इप्सिता|
Subhashree|सुभश्री|
Aarya|आर्या|Arya
Ketaki|केतकी|
Mrunal|मृणाल|Mrinal
Rutuja|ऋतुजा|
Sayali|सायली|
Shraddha|श्रद्धा|
Snehal|स्नेहल|
Tejal|तेजल|
Hetal|हेतल|
Krupa|कृपा|Kripa
Nirali|निराली|
Dhara|धारा|
Jinal|जिनल|
Khushbu|ख़ुशबू|Khushboo
Urvi|उर्वी|
Bhakti|भक्ति|
Vrushali|वृषाली|
Madhura|मधुरा|
Afreen|आफ़रीन|
Alisha|अलीशा|
Amina|अमीना|Aamina
Asma|अस्मा|
Farzana|फ़रज़ाना|
Huma|हुमा|
Iqra|इक़रा|
Mehreen|मेहरीन|
Nargis|नरगिस|
Parveen|परवीन|Parvin
Rubina|रुबीना|
Rukhsana|रुख़साना|Ruksana
Saba|सबा|
Sadia|सादिया|
Salma|सलमा|
Samina|समीना|
Shabana|शबाना|
Shazia|शाज़िया|
Tabassum|तबस्सुम|
Yasmin|यास्मीन|Yasmeen Yasmine
Zainab|ज़ैनब|
Zeenat|ज़ीनत|
Uzma|उज़्मा|
Nusrat|नुसरत|
Sania|सानिया|Saniya
Aarav|आरव|Arav
Abhay|अभय|
Abhinav|अभिनव|
Abhishek|अभिषेक|
Aditya|आदित्य|
Ajay|अजय|
Ajit|अजीत|Ajith
Akash|आकाश|Aakash
Akhil|अखिल|
Akshay|अक्षय|
Alok|आलोक|
Aman|अमन|
Amar|अमर|
Amit|अमित|
Amol|अमोल|
Anand|आनंद|
Anil|अनिल|
Aniket|अनिकेत|
Anirudh|अनिरुद्ध|Aniruddh
Ankit|अंकित|
Ankur|अंकुर|
Anoop|अनूप|Anup
Anshul|अंशुल|
Anuj|अनुज|
Arjun|अर्जुन|
Arnav|अर्णव|
Arun|अरुण|
Arvind|अरविंद|Aravind
Ashish|आशीष|Asish
Ashok|अशोक|
Ashwin|अश्विन|Aswin
Atul|अतुल|
Ayush|आयुष|
Balaji|बालाजी|
Bharat|भरत|
Bhaskar|भास्कर|
Chandan|चंदन|
Chetan|चेतन|
Deepak|दीपक|
Dev|देव|
Devendra|देवेंद्र|
Dhruv|ध्रुव|
Dinesh|दिनेश|
Ganesh|गणेश|
Gaurav|गौरव|
Girish|गिरीश|
Gopal|गोपाल|
Gautam|गौतम|Gautham Gowtham
Hari|हरि|
Harish|हरीश|
Hemant|हेमंत|Hemanth
Hitesh|हितेश|
Ishaan|ईशान|Ishan
Jagdish|जगदीश|
Jatin|जतिन|
Jay|जय|
Jayant|जयंत|
Jitendra|जितेंद्र|
Kamal|कमल|
Karan|करण|
Karthik|कार्तिक|Kartik Karthick Karthi
Kishore|किशोर|Kishor
Krishna|कृष्णा|
Kunal|कुणाल|
Lalit|ललित|
Lokesh|लोकेश|
Madhav|माधव|
Mahesh|महेश|
Manish|मनीष|
Manoj|मनोज|
Mayank|मयंक|
Mohan|मोहन|
Mukesh|मुकेश|
Murali|मुरली|
Naresh|नरेश|
Naveen|नवीन|Navin
Neeraj|नीरज|
Nikhil|निखिल|
Nilesh|नीलेश|
Nitin|नितिन|Nithin
Pankaj|पंकज|
Paras|पारस|
Pavan|पवन|Pawan
Piyush|पीयूष|
Pradeep|प्रदीप|Pradip
Prakash|प्रकाश|
Pranav|प्रणव|
Prasad|प्रसाद|
Prashant|प्रशांत|Prashanth
Praveen|प्रवीण|Pravin
Prem|प्रेम|
Puneet|पुनीत|Puneeth
Rahul|राहुल|Raahul
Raj|राज|
Rajat|रजत|
Rajesh|राजेश|
Rajiv|राजीव|Rajeev
Rakesh|राकेश|
Ram|राम|
Ramesh|रमेश|
Ranjit|रंजीत|Ranjith
Ravi|रवि|
Rishi|ऋषि|
Ritesh|रितेश|
Rohan|रोहन|
Rohit|रोहित|
Sachin|सचिन|
Sagar|सागर|
Sahil|साहिल|
Sameer|समीर|Samir
Sandeep|संदीप|Sandip
Sanjay|संजय|
Santosh|संतोष|Santhosh
Sharath|शरत|Sarath Sharat
Saurabh|सौरभ|
Shankar|शंकर|Sankar
Sharan|शरण|
Charan|चरण|
Shiv|शिव|
Shivam|शिवम|
Shubham|शुभम|
Siddharth|सिद्धार्थ|Sidharth
Sonu|सोनू|
Sourav|सौरव|Saurav
Srinivas|श्रीनिवास|Sreenivas Shrinivas
Subhash|सुभाष|
Sudhir|सुधीर|
Sumit|सुमित|
Sunil|सुनील|
Suraj|सूरज|
Suresh|सुरेश|
Tarun|तरुण|
Tushar|तुषार|
Uday|उदय|
Umesh|उमेश|
Varun|वरुण|
Vijay|विजय|
Vikas|विकास|
Vikram|विक्रम|
Vinay|विनय|
Vinayak|विनायक|
Vinod|विनोद|
Vipin|विपिन|
Vishal|विशाल|
Vivek|विवेक|
Yash|यश|
Yogesh|योगेश|
Balu|बालू|
Dhanush|धनुष|
Ganapathy|गणपति|Ganapathi
Gopi|गोपी|
Hariharan|हरिहरन|
Jagan|जगन|
Karthikeyan|कार्तिकेयन|
Kumar|कुमार|
Madan|मदन|Madhan
Manikandan|मणिकंदन|
Murugan|मुरुगन|
Muthu|मुत्तु|
Prabhu|प्रभु|
Raghav|राघव|
Raghu|रघु|
Rajkumar|राजकुमार|
Saravanan|सरवणन|
Senthil|सेंथिल|
Shiva|शिवा|Siva
Sridhar|श्रीधर|Shridhar
Srikanth|श्रीकांत|Shrikant Srikant
Subramanian|सुब्रमण्यम|Subramaniam Subramanyam
Sundar|सुंदर|
Surya|सूर्या|
Vasanth|वसंत|Vasant
Venkat|वेंकट|
Venkatesh|वेंकटेश|
Vignesh|विग्नेश|Vigneshwar
Vimal|विमल|
Yuvaraj|युवराज|Yuvraj
Bala|बाला|
Chandru|चंद्रू|
Kannan|कन्नन|
Mani|मणि|
Ramkumar|रामकुमार|
Rajan|राजन|
Sathya|सत्या|Satya
Sudarshan|सुदर्शन|
Sujith|सुजीत|Sujit
Vineeth|विनीत|Vineet
Vishnu|विष्णु|
Biju|बीजू|
Jithin|जितिन|
Sreejith|श्रीजीत|
Sanju|संजू|
Unni|उन्नी|
Manu|मनु|
Abhilash|अभिलाष|
Ajmal|अजमल|
Fahad|फ़हद|Fahadh
Chaitanya|चैतन्य|
Harsha|हर्षा|
Kalyan|कल्याण|
Phani|फणि|
Raju|राजू|
Ramu|रामू|
Sai|साई|
Teja|तेजा|
Venu|वेणु|
Vamsi|वंशी|Vamshi
Darshan|दर्शन|
Guru|गुरु|
Manjunath|मंजुनाथ|
Nagaraj|नागराज|
Raghavendra|राघवेंद्र|
Shashank|शशांक|
Sudeep|सुदीप|Sudip
Abhijit|अभिजीत|Abhijeet
Arijit|अरिजीत|
Arnab|अर्णब|
Debashish|देबाशीष|Debasis Debashis
Indranil|इंद्रनील|
Partha|पार्थ|Parth
Pritam|प्रीतम|
Rajib|राजीब|
Sayan|सायन|
Subhajit|सुभजीत|
Tanmay|तन्मय|
Anirban|अनिर्बान|
Biswajit|बिस्वजीत|
Pritish|प्रीतीश|
Subrata|सुब्रत|Subrat
Sanjib|संजीब|
Chirag|चिराग|
Dhaval|धवल|
Harshad|हर्षद|
Hardik|हार्दिक|
Jignesh|जिग्नेश|
Kaushal|कौशल|
Ketan|केतन|
Mehul|मेहुल|
Nirav|नीरव|
Pratik|प्रतीक|Prateek
Hrishikesh|ऋषिकेश|Rushikesh Rishikesh
Sanket|संकेत|
Siddhesh|सिद्धेश|
Swapnil|स्वप्निल|
Tejas|तेजस|
Omkar|ओंकार|Onkar
Mihir|मिहिर|
Bhavesh|भावेश|
Kalpesh|कल्पेश|
Paresh|परेश|
Rupesh|रूपेश|
Mitesh|मितेश|
Vaibhav|वैभव|
Amandeep|अमनदीप|
Amarjeet|अमरजीत|Amarjit
Arshdeep|अर्शदीप|
Baljeet|बलजीत|Baljit
Gurdeep|गुरदीप|
Harjeet|हरजीत|Harjit
Jasvinder|जसविंदर|Jaswinder
Jagjit|जगजीत|Jagjeet
Kuldeep|कुलदीप|
Lovepreet|लवप्रीत|
Mandeep|मनदीप|
Manjeet|मनजीत|Manjit
Navdeep|नवदीप|
Paramjit|परमजीत|Paramjeet
Rajinder|राजिंदर|
Ranbir|रणबीर|
Sukhwinder|सुखविंदर|
Sukhdeep|सुखदीप|
Tejinder|तेजिंदर|
Inder|इंदर|
Gagan|गगन|
Jaskaran|जसकरण|
Karanveer|करणवीर|Karanvir
Aamir|आमिर|Amir
Abdul|अब्दुल|
Adil|आदिल|
Ahmed|अहमद|Ahmad
Akbar|अकबर|
Ali|अली|
Anwar|अनवर|
Arif|आरिफ़|
Asif|आसिफ़|
Ayaan|अयान|Ayan
Faisal|फ़ैसल|
Farhan|फ़रहान|
Hamza|हमज़ा|
Hassan|हसन|Hasan
Imran|इमरान|
Irfan|इरफ़ान|
Javed|जावेद|
Junaid|जुनैद|
Kabir|कबीर|
Khalid|ख़ालिद|
Mohammed|मोहम्मद|Mohammad Muhammad Mohamed Mohd Md
Mohsin|मोहसिन|
Nadeem|नदीम|
Naveed|नवीद|
Rahim|रहीम|
Rashid|राशिद|
Rehan|रेहान|Rehaan Reyhan
Rizwan|रिज़वान|
Sajid|साजिद|
Salman|सलमान|
Shahid|शाहिद|
Shahrukh|शाहरुख़|Shahrukh
Sohail|सोहेल|Suhail
Tariq|तारिक़|Tarik
Waseem|वसीम|Wasim
Yusuf|यूसुफ़|Yousuf Yousaf
Zaid|ज़ैद|Zayd
Zubair|ज़ुबैर|
Arshad|अरशद|
Azhar|अज़हर|
Faiz|फ़ैज़|
Ibrahim|इब्राहिम|
Ismail|इस्माइल|
Mustafa|मुस्तफ़ा|
Nawaz|नवाज़|
Raza|रज़ा|
Shoaib|शोएब|
Usman|उस्मान|Osman
Zeeshan|ज़ीशान|
"""

INTERNATIONAL = """
John Joseph Thomas George Matthew Mathew Paul Peter James David Daniel Michael Mary Anne Ann Grace Rose
Sarah Elizabeth Jessica Jennifer Emma Olivia Sophia Emily Anna Maria Linda Susan Rachel Rebecca Christina
Christopher Robert William Richard Charles Mark Steven Stephen Andrew Anthony Kevin Brian Jason Ryan Eric
Alex Alexander Sam Samuel Benjamin Lucas Liam Noah Oliver Ethan Jacob Ava Mia Isabella Charlotte Amelia
Lily Chloe Ella Zoe Hannah Laura Julia Natalie Victoria Nancy Karen Lisa Michelle Angela Helen Catherine
Kate Katie Amy Claire Lucy Alice Diana Nicole Stephanie Tom Tony Jack Harry Henry Edward Frank Simon Martin
Patrick Sean Adam Aaron Nathan Justin Jonathan Joshua Luke Philip Vincent Victor Felix Max Leo Oscar Carlos
Juan Jose Luis Miguel Pedro Diego Omar Yuki Hiroshi Kenji Wei Mei Hans Pierre Jean Marie Sophie Giulia Marco
Luca Paolo Francesco Elena Ana Lucia Isabel Kim Steve Joe Ben Dan Chris Matt Mike Nick Rob Tim Will Jim Bob
Jenny Annie Nina Rita Ruby Ivy Jasmine Joyce Gloria Teresa Theresa Agnes Shirley Sharon Jerry Jeffrey Larry
Gary Dennis Walter Peter Albert Arthur Lawrence Roger Carl Ray Wayne Alan Ralph Roy Louis Eugene Russell Bruce
"""

entries, seen = [], {}

def key(s):
    return s.strip().lower()

def add(latin, say, lang, aliases):
    k = key(latin)
    if k in seen:
        return
    names = [k] + [key(a) for a in aliases if key(a) and key(a) not in seen and key(a) != k]
    for n in names:
        seen[n] = k
    entries.append({'key': k, 'name': latin, 'say': say + '!', 'lang': lang, 'aliases': names[1:]})

for line in INDIAN.strip().splitlines():
    parts = line.split('|')
    latin, deva = parts[0].strip(), parts[1].strip()
    aliases = parts[2].split() if len(parts) > 2 else []
    add(latin, deva, 'h', aliases + [deva])
for latin in INTERNATIONAL.split():
    add(latin, latin, 'a', [])

# ids stay the same across runs (n0001 …), so only new names need new clips
old = {}
if os.path.exists(OUT):
    for e in json.load(open(OUT)):
        old[e['key']] = e['id']
n = max([int(i[1:]) for i in old.values()] + [0])
for e in entries:
    if e['key'] in old:
        e['id'] = old[e['key']]
    else:
        n += 1
        e['id'] = 'n%04d' % n
    e['file'] = 'names/%s.mp4' % e['id']
json.dump(entries, open(OUT, 'w'), ensure_ascii=False, indent=1)
print(len(entries), 'names (%d Indian, %d international),' % (
    sum(e['lang'] == 'h' for e in entries), sum(e['lang'] == 'a' for e in entries)),
    sum(len(e['aliases']) for e in entries), 'other spellings ->', OUT)
